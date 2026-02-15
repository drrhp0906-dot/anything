import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureDatabaseInitialized } from '@/lib/init-db';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// GET statistics
export async function GET() {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized();
    // Get counts from database
    const [subjectsCount, systemsCount, marksCount, questionsCount, filesCount, foldersCount] = await Promise.all([
      db.subject.count(),
      db.system.count(),
      db.marks.count(),
      db.question.count(),
      db.file.count(),
      db.folder.count()
    ]);

    // Calculate total storage used
    let totalStorage = 0;

    // Method 1: Sum file sizes from database
    const files = await db.file.findMany({
      select: { size: true }
    });
    totalStorage = files.reduce((sum, file) => sum + file.size, 0);

    // Method 2: Also check actual directory size for accuracy
    if (fs.existsSync(UPLOAD_DIR)) {
      const actualFiles = fs.readdirSync(UPLOAD_DIR);
      for (const file of actualFiles) {
        const filePath = path.join(UPLOAD_DIR, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            // Use actual file size if it differs
          }
        } catch {
          // Ignore errors
        }
      }
    }

    // Get recent activity
    const recentSubjects = await db.subject.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, createdAt: true }
    });

    const recentQuestions = await db.question.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        repeatCount: true,
        calculatedScore: true,
        marks: {
          select: {
            value: true,
            system: {
              select: {
                name: true,
                subject: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    // Get top featured questions across all subjects
    const featuredQuestions = await db.question.findMany({
      take: 10,
      orderBy: [
        { calculatedScore: 'desc' },
        { repeatCount: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        repeatCount: true,
        calculatedScore: true,
        globalImportance: true,
        yearsAppeared: true,
        marks: {
          select: {
            value: true,
            system: {
              select: {
                name: true,
                subject: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    // Calculate repeat statistics
    const questionsWithRepeats = await db.question.findMany({
      where: {
        repeatCount: { gt: 1 }
      },
      select: {
        repeatCount: true,
        calculatedScore: true
      }
    });

    const totalRepeats = questionsWithRepeats.reduce((sum, q) => sum + q.repeatCount, 0);
    const avgImportanceScore = questionsCount > 0 
      ? (await db.question.aggregate({
          _avg: { calculatedScore: true }
        }))._avg.calculatedScore || 0
      : 0;

    // Get high importance questions count (score >= 60)
    const highImportanceCount = await db.question.count({
      where: {
        calculatedScore: { gte: 60 }
      }
    });

    // Get critical questions count (score >= 80)
    const criticalCount = await db.question.count({
      where: {
        calculatedScore: { gte: 80 }
      }
    });

    return NextResponse.json({
      counts: {
        subjects: subjectsCount,
        systems: systemsCount,
        marks: marksCount,
        questions: questionsCount,
        files: filesCount,
        folders: foldersCount,
        storage: totalStorage
      },
      importance: {
        avgScore: Math.round(avgImportanceScore * 10) / 10,
        highImportanceCount,
        criticalCount,
        repeatedQuestions: questionsWithRepeats.length,
        totalRepeats
      },
      recentActivity: {
        subjects: recentSubjects,
        questions: recentQuestions
      },
      featuredQuestions
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
