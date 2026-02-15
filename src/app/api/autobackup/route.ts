import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'custom.db');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const CONFIG_FILE = path.join(process.cwd(), 'backups', 'config.json');

interface BackupConfig {
  autoBackupEnabled: boolean;
  backupInterval: number; // in minutes
  lastBackup: string | null;
  nextBackup: string | null;
  maxBackups: number;
  retentionDays: number;
}

function getConfig(): BackupConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // Ignore errors
  }
  return {
    autoBackupEnabled: true,
    backupInterval: 30, // 30 minutes default
    lastBackup: null,
    nextBackup: null,
    maxBackups: 20,
    retentionDays: 30
  };
}

function saveConfig(config: BackupConfig): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function createBackup(): Promise<{ success: boolean; filename: string; size: number; error?: string }> {
  try {
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
      type: 'auto-backup',
      data: {
        subjects,
        systems,
        marks,
        questions,
        folders,
        files
      }
    };

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `auto-backup-${timestamp}.json`;
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);
    
    const content = JSON.stringify(exportData, null, 2);
    fs.writeFileSync(backupFilePath, content);

    return {
      success: true,
      filename: backupFileName,
      size: Buffer.byteLength(content, 'utf-8')
    };
  } catch (error) {
    console.error('Backup error:', error);
    return {
      success: false,
      filename: '',
      size: 0,
      error: String(error)
    };
  }
}

function cleanupOldBackups(config: BackupConfig): void {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return;

    const now = new Date();
    const retentionMs = config.retentionDays * 24 * 60 * 60 * 1000;
    
    const backupFiles = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('auto-backup-') && f.endsWith('.json'))
      .map(f => {
        const filePath = path.join(BACKUP_DIR, f);
        const stats = fs.statSync(filePath);
        return { name: f, path: filePath, mtime: stats.mtime };
      })
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    // Delete old backups based on retention
    for (const file of backupFiles) {
      const age = now.getTime() - file.mtime.getTime();
      if (age > retentionMs) {
        fs.unlinkSync(file.path);
      }
    }

    // Delete excess backups based on maxBackups
    const remainingFiles = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('auto-backup-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (remainingFiles.length > config.maxBackups) {
      const toDelete = remainingFiles.slice(config.maxBackups);
      for (const file of toDelete) {
        fs.unlinkSync(path.join(BACKUP_DIR, file));
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

// GET - Get auto-backup status and configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Get current config and status
    if (action === 'config' || !action) {
      const config = getConfig();
      
      // Get list of auto backups
      const autoBackups: { name: string; size: number; date: string; }[] = [];
      if (fs.existsSync(BACKUP_DIR)) {
        const files = fs.readdirSync(BACKUP_DIR)
          .filter(f => f.startsWith('auto-backup-') && f.endsWith('.json'));
        for (const file of files) {
          const filePath = path.join(BACKUP_DIR, file);
          const stats = fs.statSync(filePath);
          autoBackups.push({
            name: file,
            size: stats.size,
            date: stats.mtime.toISOString()
          });
        }
      }

      // Check if we need to trigger a backup
      let shouldBackup = false;
      if (config.autoBackupEnabled && config.nextBackup) {
        const nextBackupTime = new Date(config.nextBackup);
        if (new Date() >= nextBackupTime) {
          shouldBackup = true;
        }
      }

      return NextResponse.json({
        config,
        autoBackups: autoBackups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        shouldBackup,
        currentTime: new Date().toISOString()
      });
    }

    // Trigger auto backup check
    if (action === 'check') {
      const config = getConfig();
      
      if (!config.autoBackupEnabled) {
        return NextResponse.json({ needsBackup: false, message: 'Auto-backup disabled' });
      }

      const now = new Date();
      const nextBackup = config.nextBackup ? new Date(config.nextBackup) : null;
      
      if (!nextBackup || now >= nextBackup) {
        // Time for a backup!
        const result = await createBackup();
        
        if (result.success) {
          // Update config
          config.lastBackup = now.toISOString();
          config.nextBackup = new Date(now.getTime() + config.backupInterval * 60 * 1000).toISOString();
          saveConfig(config);
          
          // Cleanup old backups
          cleanupOldBackups(config);
          
          return NextResponse.json({
            needsBackup: true,
            backupCreated: true,
            backup: result,
            config
          });
        } else {
          return NextResponse.json({
            needsBackup: true,
            backupCreated: false,
            error: result.error
          });
        }
      }

      return NextResponse.json({
        needsBackup: false,
        nextBackup: config.nextBackup,
        lastBackup: config.lastBackup
      });
    }

    // Force immediate backup
    if (action === 'now') {
      const result = await createBackup();
      
      if (result.success) {
        const config = getConfig();
        config.lastBackup = new Date().toISOString();
        config.nextBackup = new Date(Date.now() + config.backupInterval * 60 * 1000).toISOString();
        saveConfig(config);
        cleanupOldBackups(config);
        
        return NextResponse.json({
          success: true,
          backup: result,
          config
        });
      }
      
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auto-backup error:', error);
    return NextResponse.json({ error: 'Failed to process auto-backup' }, { status: 500 });
  }
}

// POST - Update auto-backup configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = getConfig();

    // Update config values
    if (body.autoBackupEnabled !== undefined) {
      config.autoBackupEnabled = body.autoBackupEnabled;
    }
    if (body.backupInterval !== undefined) {
      config.backupInterval = Math.max(5, Math.min(1440, body.backupInterval)); // 5 min to 24 hours
    }
    if (body.maxBackups !== undefined) {
      config.maxBackups = Math.max(1, Math.min(100, body.maxBackups));
    }
    if (body.retentionDays !== undefined) {
      config.retentionDays = Math.max(1, Math.min(365, body.retentionDays));
    }

    // Calculate next backup time if enabled
    if (config.autoBackupEnabled && !config.nextBackup) {
      config.nextBackup = new Date(Date.now() + config.backupInterval * 60 * 1000).toISOString();
    } else if (!config.autoBackupEnabled) {
      config.nextBackup = null;
    }

    saveConfig(config);

    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Config update error:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
