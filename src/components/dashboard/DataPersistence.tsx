'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Database,
  Download,
  Upload,
  HardDrive,
  FileJson,
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface DataStatus {
  database: {
    exists: boolean;
    size: number;
    path: string;
  };
  uploads: {
    count: number;
    size: number;
    path: string;
  };
  counts: {
    subjects: number;
    systems: number;
    marks: number;
    questions: number;
    folders: number;
    files: number;
  };
  backups: {
    name: string;
    size: number;
    date: string;
  }[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function DataPersistence() {
  const [status, setStatus] = useState<DataStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/backup?action=status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/backup?action=export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exam-database-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        fetchStatus(); // Refresh to show new backup
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setImporting(true);
    setImportResult(null);
    try {
      const text = await importFile.text();
      const jsonData = JSON.parse(text);

      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: jsonData.data })
      });

      const result = await response.json();
      if (response.ok) {
        setImportResult({ success: true, message: `Imported: ${result.stats.subjects} subjects, ${result.stats.questions} questions` });
        fetchStatus();
      } else {
        setImportResult({ success: false, message: result.error || 'Import failed' });
      }
    } catch (error) {
      setImportResult({ success: false, message: 'Invalid backup file format' });
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteBackup = async (backupName: string) => {
    try {
      const response = await fetch(`/api/backup?backup=${encodeURIComponent(backupName)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchStatus();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDownloadBackup = async (backupName: string) => {
    try {
      const response = await fetch(`/api/backup?backup=${encodeURIComponent(backupName)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = backupName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Unable to load data status</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-600" />
          Data Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Persistence Status */}
        <div className="flex items-center gap-2 text-sm">
          {status.database.exists ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700 font-medium">Data is saved & persistent</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-amber-700">Database not found</span>
            </>
          )}
        </div>

        {/* Storage Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <HardDrive className="h-3.5 w-3.5" />
              Database
            </div>
            <div className="font-medium">{formatBytes(status.database.size)}</div>
          </div>
          <div className="p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Upload className="h-3.5 w-3.5" />
              Files
            </div>
            <div className="font-medium">{status.uploads.count} files ({formatBytes(status.uploads.size)})</div>
          </div>
        </div>

        {/* Data Counts */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{status.counts.subjects} subjects</Badge>
          <Badge variant="secondary">{status.counts.questions} questions</Badge>
          <Badge variant="secondary">{status.counts.files} files</Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleExport}
            disabled={exporting}
            className="flex-1"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            {exporting ? 'Exporting...' : 'Export Backup'}
          </Button>

          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
                <DialogDescription>
                  Select a backup JSON file to import. This will merge with existing data.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {importResult && (
                  <div className={`mt-3 p-2 rounded text-sm ${importResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {importResult.message}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setImportDialogOpen(false); setImportResult(null); }}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!importFile || importing}>
                  {importing ? 'Importing...' : 'Import Data'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Existing Backups */}
        {status.backups.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Saved Backups</h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {status.backups.slice(0, 5).map((backup) => (
                <div key={backup.name} className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileJson className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{backup.name}</p>
                      <p className="text-muted-foreground">{formatBytes(backup.size)} • {formatDate(backup.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleDownloadBackup(backup.name)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteBackup(backup.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-muted-foreground">
          💾 Your data is automatically saved to the SQLite database. Export backups regularly for extra safety.
        </p>
      </CardContent>
    </Card>
  );
}
