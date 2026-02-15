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
import { Plus, Trash2, ChevronDown, ChevronRight, Hash, HelpCircle } from 'lucide-react';
import { QuestionList } from './QuestionList';

interface Marks {
  id: string;
  value: number;
  description: string | null;
  createdAt: string;
  _count?: {
    questions: number;
  };
}

interface MarksListProps {
  systemId: string;
  onRefresh: () => void;
}

export function MarksList({ systemId, onRefresh }: MarksListProps) {
  const [marks, setMarks] = useState<Marks[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedMarks, setExpandedMarks] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ value: '', description: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMarks();
  }, [systemId]);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/marks?systemId=${systemId}`);
      if (response.ok) {
        const data = await response.json();
        setMarks(data);
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMarks = (id: string) => {
    const newExpanded = new Set(expandedMarks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMarks(newExpanded);
  };

  const handleCreate = async () => {
    const valueNum = parseInt(formData.value, 10);
    if (isNaN(valueNum) || valueNum <= 0) {
      alert('Please enter a valid marks value (positive number)');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          value: valueNum, 
          description: formData.description,
          systemId 
        }),
      });

      if (response.ok) {
        setFormData({ value: '', description: '' });
        setDialogOpen(false);
        fetchMarks();
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create marks');
      }
    } catch (error) {
      console.error('Error creating marks:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/marks?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMarks();
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting marks:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Loading marks...
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Hash className="h-4 w-4 text-purple-600" />
          Marks Categories
        </h4>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-3 w-3 mr-1" />
              Add Marks
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Marks Category</DialogTitle>
              <DialogDescription>
                Add a marks category (e.g., 2 marks, 5 marks, 10 marks) to organize questions by their weight.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="marksValue">Marks Value *</Label>
                <Input
                  id="marksValue"
                  type="number"
                  min="1"
                  placeholder="e.g., 2, 5, 10"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the marks value for questions in this category
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marksDescription">Description (Optional)</Label>
                <Textarea
                  id="marksDescription"
                  placeholder="e.g., Short answer questions, Essay questions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating || !formData.value.trim()}>
                {isCreating ? 'Creating...' : 'Create Marks Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {marks.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No marks categories yet. Add marks (e.g., 2, 5, 10) to organize questions.
        </div>
      ) : (
        <div className="space-y-1">
          {marks.map((mark) => (
            <Collapsible
              key={mark.id}
              open={expandedMarks.has(mark.id)}
              onOpenChange={() => toggleMarks(mark.id)}
            >
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                <CollapsibleTrigger className="flex items-center gap-2 flex-1 cursor-pointer">
                  {expandedMarks.has(mark.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <Badge variant="secondary" className="font-bold">
                      {mark.value} Marks
                    </Badge>
                    {mark.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        - {mark.description}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <HelpCircle className="h-3 w-3 mr-1" />
                    {mark._count?.questions || 0} Q
                  </Badge>
                </CollapsibleTrigger>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      disabled={isDeleting === mark.id}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Marks Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the &quot;{mark.value} Marks&quot; category? 
                        This will permanently delete all associated questions and files. 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(mark.id)}
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
                  <QuestionList marksId={mark.id} onRefresh={fetchMarks} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
