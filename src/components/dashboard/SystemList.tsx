'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, ChevronRight, Layers, Hash } from 'lucide-react';
import { MarksList } from './MarksList';

interface System {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count?: {
    marks: number;
  };
}

interface SystemListProps {
  subjectId: string;
  onRefresh: () => void;
}

export function SystemList({ subjectId, onRefresh }: SystemListProps) {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedSystems, setExpandedSystems] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSystems();
  }, [subjectId]);

  const fetchSystems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/systems?subjectId=${subjectId}`);
      if (response.ok) {
        const data = await response.json();
        setSystems(data);
      }
    } catch (error) {
      console.error('Error fetching systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSystem = (id: string) => {
    const newExpanded = new Set(expandedSystems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSystems(newExpanded);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/systems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subjectId }),
      });

      if (response.ok) {
        setFormData({ name: '', description: '' });
        setDialogOpen(false);
        fetchSystems();
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating system:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/systems?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSystems();
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting system:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Loading systems...
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" />
          Systems
        </h4>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New System</DialogTitle>
              <DialogDescription>
                Add a new system under this subject.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name *</Label>
                <Input
                  id="systemName"
                  placeholder="e.g., Cardiovascular System"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemDescription">Description</Label>
                <Textarea
                  id="systemDescription"
                  placeholder="Optional description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating || !formData.name.trim()}>
                {isCreating ? 'Creating...' : 'Create System'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {systems.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No systems yet. Add a system to organize questions.
        </div>
      ) : (
        <div className="space-y-1">
          {systems.map((system) => (
            <Collapsible
              key={system.id}
              open={expandedSystems.has(system.id)}
              onOpenChange={() => toggleSystem(system.id)}
            >
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                <CollapsibleTrigger className="flex items-center gap-2 flex-1 cursor-pointer">
                  {expandedSystems.has(system.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <span className="font-medium text-sm">{system.name}</span>
                    {system.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        - {system.description}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Hash className="h-3 w-3 mr-1" />
                    {system._count?.marks || 0} marks
                  </Badge>
                </CollapsibleTrigger>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      disabled={isDeleting === system.id}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete System</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{system.name}&quot;? This will
                        permanently delete all associated marks, questions, and files. This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(system.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <CollapsibleContent>
                <div className="ml-4 mt-1 pl-3 border-l-2 border-muted">
                  <MarksList systemId={system.id} onRefresh={fetchSystems} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
