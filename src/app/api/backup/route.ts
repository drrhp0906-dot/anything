import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'custom.db');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// GET - Export all data or check backup status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Check database and storage info
    if (action === 'status') {
      const dbExists = fs.existsSync(DB_PATH);
      const dbStats = dbExists ? fs.statSync(DB_PATH) : null;
      
      let uploadsSize = 0;
      let uploadsCount = 0;
      if (fs.existsSync(UPLOADS_DIR)) {
        const files = fs.readdirSync(UPLOADS_DIR);
        uploadsCount = files.length;
        for (const file of files) {
          const filePath = path.join(UPLOADS_DIR, file);
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            uploadsSize += stats.size;
          }
        }
      }

      // Get counts
      const [subjects, systems, marks, questions, folders, filesCount] = await Promise.all([
        db.subject.count(),
        db.system.count(),
        db.marks.count(),
        db.question.count(),
        db.folder.count(),
        db.file.count()
      ]);

      // Check for existing backups
      const backupFiles: { name: string; size: number; date: string; }[] = [];
      if (fs.existsSync(BACKUP_DIR)) {
        const backupFileList = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
        for (const file of backupFileList) {
          const filePath = path.join(BACKUP_DIR, file);
          const stats = fs.statSync(filePath);
          backupFiles.push({
            name: file,
            size: stats.size,
            date: stats.mtime.toISOString()
          });
        }
      }

      return NextResponse.json({
        database: {
          exists: dbExists,
          size: dbStats?.size || 0,
          path: DB_PATH
        },
        uploads: {
          count: uploadsCount,
          size: uploadsSize,
          path: UPLOADS_DIR
        },
        counts: {
          subjects,
          systems,
          marks,
          questions,
          folders,
          files: filesCount
        },
        backups: backupFiles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      });
    }

    // Export all data as JSON
    if (action === 'export') {
      const [subjects, systems, marks, questions, folders, files] = await Promise.all([
        db.subject.findMany({ include: { systems: true } }),
        db.system.findMany({ include: { marks: true, subject: true } }),
        db.marks.findMany({ include: { questions: true, system: true } }),
        db.question.findMany({ include: { marks: true, files: true, folders: true } }),
        db.folder.findMany({ include: { files: true, question: true } }),
        db.file.findMany({ include: { question: true, folder: true } })
      ]);

      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          subjects,
          systems,
          marks,
          questions,
          folders,
          files
        }
      };

      // Save backup to disk
      if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.json`;
      const backupFilePath = path.join(BACKUP_DIR, backupFileName);
      
      fs.writeFileSync(backupFilePath, JSON.stringify(exportData, null, 2));

      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="exam-database-backup-${timestamp}.json"`
        }
      });
    }

    // Download specific backup
    const backupName = searchParams.get('backup');
    if (backupName) {
      const backupPath = path.join(BACKUP_DIR, backupName);
      if (!fs.existsSync(backupPath)) {
        return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
      }
      
      const content = fs.readFileSync(backupPath, 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${backupName}"`
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
  }
}

// POST - Import data from JSON backup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, mode = 'merge' } = body; // mode: 'merge' or 'replace'

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const { subjects, systems, marks, questions, folders, files } = data;

    // Use transaction for atomic import
    const result = await db.$transaction(async (tx) => {
      const stats = {
        subjects: 0,
        systems: 0,
        marks: 0,
        questions: 0,
        folders: 0,
        files: 0
      };

      // Import subjects
      if (subjects && Array.isArray(subjects)) {
        for (const subject of subjects) {
          await tx.subject.upsert({
            where: { id: subject.id },
            create: {
              id: subject.id,
              name: subject.name,
              description: subject.description,
              createdAt: new Date(subject.createdAt),
              updatedAt: new Date(subject.updatedAt)
            },
            update: {
              name: subject.name,
              description: subject.description,
              updatedAt: new Date()
            }
          });
          stats.subjects++;
        }
      }

      // Import systems
      if (systems && Array.isArray(systems)) {
        for (const system of systems) {
          await tx.system.upsert({
            where: { id: system.id },
            create: {
              id: system.id,
              name: system.name,
              description: system.description,
              subjectId: system.subjectId,
              createdAt: new Date(system.createdAt),
              updatedAt: new Date(system.updatedAt)
            },
            update: {
              name: system.name,
              description: system.description,
              updatedAt: new Date()
            }
          });
          stats.systems++;
        }
      }

      // Import marks
      if (marks && Array.isArray(marks)) {
        for (const mark of marks) {
          await tx.marks.upsert({
            where: { id: mark.id },
            create: {
              id: mark.id,
              value: mark.value,
              description: mark.description,
              systemId: mark.systemId,
              createdAt: new Date(mark.createdAt),
              updatedAt: new Date(mark.updatedAt)
            },
            update: {
              value: mark.value,
              description: mark.description,
              updatedAt: new Date()
            }
          });
          stats.marks++;
        }
      }

      // Import questions
      if (questions && Array.isArray(questions)) {
        for (const question of questions) {
          await tx.question.upsert({
            where: { id: question.id },
            create: {
              id: question.id,
              title: question.title,
              content: question.content,
              terminologies: question.terminologies,
              repeatCount: question.repeatCount,
              yearsAppeared: question.yearsAppeared,
              lastAppearedYear: question.lastAppearedYear,
              globalImportance: question.globalImportance,
              calculatedScore: question.calculatedScore,
              marksId: question.marksId,
              createdAt: new Date(question.createdAt),
              updatedAt: new Date(question.updatedAt)
            },
            update: {
              title: question.title,
              content: question.content,
              terminologies: question.terminologies,
              repeatCount: question.repeatCount,
              yearsAppeared: question.yearsAppeared,
              lastAppearedYear: question.lastAppearedYear,
              globalImportance: question.globalImportance,
              calculatedScore: question.calculatedScore,
              updatedAt: new Date()
            }
          });
          stats.questions++;
        }
      }

      // Import folders
      if (folders && Array.isArray(folders)) {
        for (const folder of folders) {
          await tx.folder.upsert({
            where: { id: folder.id },
            create: {
              id: folder.id,
              name: folder.name,
              description: folder.description,
              color: folder.color,
              icon: folder.icon,
              questionId: folder.questionId,
              createdAt: new Date(folder.createdAt),
              updatedAt: new Date(folder.updatedAt)
            },
            update: {
              name: folder.name,
              description: folder.description,
              color: folder.color,
              icon: folder.icon,
              updatedAt: new Date()
            }
          });
          stats.folders++;
        }
      }

      // Import files metadata (not actual files)
      if (files && Array.isArray(files)) {
        for (const file of files) {
          await tx.file.upsert({
            where: { id: file.id },
            create: {
              id: file.id,
              name: file.name,
              originalName: file.originalName,
              mimeType: file.mimeType,
              size: file.size,
              path: file.path,
              questionId: file.questionId,
              folderId: file.folderId,
              createdAt: new Date(file.createdAt),
              updatedAt: new Date(file.updatedAt)
            },
            update: {
              originalName: file.originalName,
              folderId: file.folderId,
              updatedAt: new Date()
            }
          });
          stats.files++;
        }
      }

      return stats;
    });

    return NextResponse.json({
      success: true,
      message: 'Data imported successfully',
      stats: result
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}

// DELETE - Delete a backup file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backupName = searchParams.get('backup');

    if (!backupName) {
      return NextResponse.json({ error: 'Backup name required' }, { status: 400 });
    }

    const backupPath = path.join(BACKUP_DIR, backupName);
    if (!fs.existsSync(backupPath)) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    fs.unlinkSync(backupPath);
    return NextResponse.json({ success: true, message: 'Backup deleted' });
  } catch (error) {
    console.error('Delete backup error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
