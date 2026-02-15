'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Folder as FolderIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Edit3,
  FileText,
  Image,
  File,
  Upload,
  Download,
} from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  createdAt: string;
  _count?: {
    files: number;
  };
}

interface FileItem {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface FolderListProps {
  questionId: string;
  onRefresh: () => void;
}

const FOLDER_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-500' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-500' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: 'text-pink-500' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType === 'application/pdf') return FileText;
  return File;
}

function getFileColor(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'text-purple-600';
  if (mimeType === 'application/pdf') return 'text-red-600';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'text-blue-600';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'text-orange-600';
  return 'text-gray-600';
}

export function FolderList({ questionId, onRefresh }: FolderListProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ name: '', description: '', color: 'blue' });
  const [dialogOpen, setDialogOpen] = useState(false);

  // File state per folder
  const [folderFiles, setFolderFiles] = useState<Record<string, FileItem[]>>({});
  const [uploadingFolder, setUploadingFolder] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchFolders();
  }, [questionId]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/folders?questionId=${questionId}`);
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderFiles = async (folderId: string) => {
    try {
      const response = await fetch(`/api/files?folderId=${folderId}`);
      if (response.ok) {
        const data = await response.json();
        setFolderFiles(prev => ({ ...prev, [folderId]: data }));
      }
    } catch (error) {
      console.error('Error fetching folder files:', error);
    }
  };

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      fetchFolderFiles(id);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, questionId }),
      });

      if (response.ok) {
        setFormData({ name: '', description: '', color: 'blue' });
        setDialogOpen(false);
        fetchFolders();
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/folders?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFolders();
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFileUpload = async (folderId: string, file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      'image/png',
      'image/jpeg',
      'image/gif',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('File type not allowed. Allowed types: PDF, DOCX, images (PNG, JPG, JPEG, GIF), PPT/PPTX');
      return;
    }

    setUploadingFolder(folderId);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('questionId', questionId);
      formDataUpload.append('folderId', folderId);

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        fetchFolderFiles(folderId);
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingFolder(null);
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files?id=${file.id}&download=true`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteFile = async (fileId: string, folderId: string) => {
    setDeletingFile(fileId);
    try {
      const response = await fetch(`/api/files?id=${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFolderFiles(folderId);
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setDeletingFile(null);
    }
  };

  if (loading) {
    return (
      <div className="py-2 text-center text-xs text-muted-foreground">
        Loading folders...
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <h6 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
          <FolderIcon className="h-3.5 w-3.5 text-purple-600" />
          Reference Folders
        </h6>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderIcon className="h-5 w-5" />
                Add Reference Folder
              </DialogTitle>
              <DialogDescription>
                Create a folder to organize reference files for this question.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folderName">Folder Name *</Label>
                <Input
                  id="folderName"
                  placeholder="e.g., Study Notes, Reference Materials"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folderDescription">Description</Label>
                <Textarea
                  id="folderDescription"
                  placeholder="Optional description for this folder..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Folder Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(FOLDER_COLORS).map(([color, styles]) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        formData.color === color 
                          ? `${styles.bg} ${styles.border} ring-2 ring-offset-1 ring-${color}-400` 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: formData.color === color ? undefined : undefined,
                      }}
                    >
                      <FolderIcon className={`h-4 w-4 mx-auto ${styles.icon}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating || !formData.name.trim()}>
                {isCreating ? 'Creating...' : 'Create Folder'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-3 text-xs text-muted-foreground border border-dashed rounded-md">
          <FolderIcon className="h-6 w-6 mx-auto mb-1 opacity-50" />
          No reference folders. Add folders to organize files.
        </div>
      ) : (
        <div className="space-y-1">
          {folders.map((folder) => {
            const colorStyles = FOLDER_COLORS[folder.color] || FOLDER_COLORS.blue;
            const files = folderFiles[folder.id] || [];
            
            return (
              <Collapsible
                key={folder.id}
                open={expandedFolders.has(folder.id)}
                onOpenChange={() => toggleFolder(folder.id)}
              >
                <div className={`flex items-center justify-between p-2 rounded-md border ${colorStyles.bg} ${colorStyles.border} transition-colors`}>
                  <CollapsibleTrigger className="flex items-center gap-2 flex-1 cursor-pointer">
                    {expandedFolders.has(folder.id) ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                    <FolderIcon className={`h-4 w-4 ${colorStyles.icon}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`font-medium text-sm ${colorStyles.text} truncate block`}>
                        {folder.name}
                      </span>
                      {folder.description && (
                        <span className="text-xs text-muted-foreground truncate block">
                          {folder.description}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      <FileText className="h-3 w-3 mr-1" />
                      {folder._count?.files || 0}
                    </Badge>
                  </CollapsibleTrigger>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive shrink-0"
                        disabled={isDeleting === folder.id}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{folder.name}&quot;? All files inside will be permanently deleted. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(folder.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <CollapsibleContent>
                  <div className="ml-4 mt-2 p-2 border rounded-md bg-background space-y-2">
                    {/* Upload area */}
                    <div
                      className={`border-2 border-dashed rounded-md p-2 text-center transition-colors cursor-pointer ${
                        uploadingFolder === folder.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                      onClick={() => fileInputRefs.current[folder.id]?.click()}
                    >
                      <input
                        ref={(el) => { fileInputRefs.current[folder.id] = el; }}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.gif"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach(file => 
                              handleFileUpload(folder.id, file)
                            );
                          }
                        }}
                      />
                      {uploadingFolder === folder.id ? (
                        <div className="text-xs text-muted-foreground">Uploading...</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          <Upload className="h-3 w-3 mx-auto mb-1" />
                          Drop files or click to upload
                        </div>
                      )}
                    </div>

                    {/* Files list */}
                    {files.length > 0 && (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {files.map((file) => {
                          const Icon = getFileIcon(file.mimeType);
                          const fileColor = getFileColor(file.mimeType);
                          
                          return (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-1.5 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Icon className={`h-3.5 w-3.5 shrink-0 ${fileColor}`} />
                                <p className="text-xs font-medium truncate">{file.originalName}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={() => handleDownload(file)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 text-destructive hover:text-destructive"
                                      disabled={deletingFile === file.id}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete File</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Delete &quot;{file.originalName}&quot;? This cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteFile(file.id, folder.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}
