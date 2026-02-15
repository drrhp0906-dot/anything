'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Cloud,
  CloudOff,
  Clock,
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  CloudUpload
} from 'lucide-react';

interface BackupConfig {
  autoBackupEnabled: boolean;
  backupInterval: number;
  lastBackup: string | null;
  nextBackup: string | null;
  maxBackups: number;
  retentionDays: number;
}

interface AutoBackup {
  name: string;
  size: number;
  date: string;
}

interface AutoBackupStatus {
  config: BackupConfig;
  autoBackups: AutoBackup[];
  shouldBackup: boolean;
  currentTime: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTimeRemaining(targetDate: string): string {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return 'Now';

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function AutoBackupCloud() {
  const [status, setStatus] = useState<AutoBackupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    backupInterval: 30,
    maxBackups: 20,
    retentionDays: 30
  });
  const [timeRemaining, setTimeRemaining] = useState('');

  // Fetch status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/autobackup?action=config');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setSettings({
          backupInterval: data.config.backupInterval,
          maxBackups: data.config.maxBackups,
          retentionDays: data.config.retentionDays
        });
      }
    } catch (error) {
      console.error('Error fetching auto-backup status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check and trigger backup if needed
  const checkAndBackup = useCallback(async () => {
    try {
      const response = await fetch('/api/autobackup?action=check');
      if (response.ok) {
        const data = await response.json();
        if (data.backupCreated) {
          fetchStatus();
        }
      }
    } catch (error) {
      console.error('Error checking backup:', error);
    }
  }, [fetchStatus]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Update countdown timer
  useEffect(() => {
    if (!status?.config.nextBackup) return;

    const updateTimer = () => {
      if (status.config.nextBackup) {
        setTimeRemaining(formatTimeRemaining(status.config.nextBackup));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [status?.config.nextBackup]);

  // Auto-check for backup every 30 seconds
  useEffect(() => {
    if (!status?.config.autoBackupEnabled) return;

    const checkInterval = setInterval(() => {
      checkAndBackup();
    }, 30000); // Check every 30 seconds

    // Also check immediately if shouldBackup is true
    if (status.shouldBackup) {
      checkAndBackup();
    }

    return () => clearInterval(checkInterval);
  }, [status?.config.autoBackupEnabled, status?.shouldBackup, checkAndBackup]);

  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const response = await fetch('/api/autobackup?action=now');
      if (response.ok) {
        fetchStatus();
      }
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleToggleAutoBackup = async (enabled: boolean) => {
    try {
      await fetch('/api/autobackup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoBackupEnabled: enabled })
      });
      fetchStatus();
    } catch (error) {
      console.error('Error toggling auto-backup:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/autobackup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setSettingsOpen(false);
      fetchStatus();
    } catch (error) {
      console.error('Error saving settings:', error);
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
      console.error('Error downloading backup:', error);
    }
  };

  const handleDeleteBackup = async (backupName: string) => {
    try {
      await fetch(`/api/backup?backup=${encodeURIComponent(backupName)}`, {
        method: 'DELETE'
      });
      fetchStatus();
    } catch (error) {
      console.error('Error deleting backup:', error);
    }
  };

  if (loading) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="py-4">
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 bg-blue-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  const { config, autoBackups } = status;

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.autoBackupEnabled ? (
              <Cloud className="h-4 w-4 text-blue-600" />
            ) : (
              <CloudOff className="h-4 w-4 text-gray-400" />
            )}
            Auto Cloud Backup
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.autoBackupEnabled}
              onCheckedChange={handleToggleAutoBackup}
            />
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Auto-Backup Settings</DialogTitle>
                  <DialogDescription>
                    Configure how often backups are created and how long they're kept.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="interval">Backup Interval (minutes)</Label>
                    <Input
                      id="interval"
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.backupInterval}
                      onChange={(e) => setSettings({ ...settings, backupInterval: parseInt(e.target.value) || 30 })}
                    />
                    <p className="text-xs text-muted-foreground">How often to auto-backup (5 min to 24 hours)</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBackups">Maximum Backups to Keep</Label>
                    <Input
                      id="maxBackups"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.maxBackups}
                      onChange={(e) => setSettings({ ...settings, maxBackups: parseInt(e.target.value) || 20 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention">Retention Days</Label>
                    <Input
                      id="retention"
                      type="number"
                      min="1"
                      max="365"
                      value={settings.retentionDays}
                      onChange={(e) => setSettings({ ...settings, retentionDays: parseInt(e.target.value) || 30 })}
                    />
                    <p className="text-xs text-muted-foreground">Backups older than this will be auto-deleted</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {config.autoBackupEnabled ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-medium">Auto-backup enabled</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-amber-700">Auto-backup disabled</span>
              </>
            )}
          </div>
          {config.autoBackupEnabled && config.nextBackup && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Next: {timeRemaining}
            </Badge>
          )}
        </div>

        {/* Backup Info */}
        {config.lastBackup && (
          <div className="text-xs text-muted-foreground">
            Last backup: {formatDate(config.lastBackup)}
          </div>
        )}

        {/* Manual Backup Button */}
        <Button 
          size="sm" 
          className="w-full"
          onClick={handleCreateBackup}
          disabled={creatingBackup}
        >
          {creatingBackup ? (
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <CloudUpload className="h-3.5 w-3.5 mr-1.5" />
          )}
          {creatingBackup ? 'Creating Backup...' : 'Backup Now'}
        </Button>

        {/* Recent Auto-Backups */}
        {autoBackups.length > 0 && (
          <div className="pt-3 border-t border-blue-200">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Recent Auto-Backups</h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {autoBackups.slice(0, 5).map((backup) => (
                <div key={backup.name} className="flex items-center justify-between p-2 bg-white/50 rounded text-xs">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{backup.name.replace('auto-backup-', '').replace('.json', '')}</p>
                    <p className="text-muted-foreground">{formatBytes(backup.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleDownloadBackup(backup.name)}
                      title="Download to your computer (Cloud Sync)"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cloud Sync Info */}
        <div className="pt-2 text-xs text-muted-foreground flex items-start gap-1.5">
          <Cloud className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Click <Download className="h-3 w-3 inline mx-0.5" /> to download backups to your computer - 
            this is your "cloud sync" for safekeeping!
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
