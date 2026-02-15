'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Trash2, ChevronDown, ChevronRight, BookOpen, Layers, Star } from 'lucide-react';
import { SystemList } from './SystemList';
import { FeaturedQuestions } from './FeaturedQuestions';

interface Subject {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count?: {
    systems: number;
  };
}

interface SubjectListProps {
  subjects: Subject[];
  onRefresh: () => void;
}

export function SubjectList({ subjects, onRefresh }: SubjectListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleSubject = (id: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSubjects(newExpanded);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', description: '' });
        setDialogOpen(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating subject:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/subjects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          Subjects
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Create a new subject to organize your exam questions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Anatomy, Physiology"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
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
                {isCreating ? 'Creating...' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No subjects yet. Add your first subject to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => (
              <Collapsible
                key={subject.id}
                open={expandedSubjects.has(subject.id)}
                onOpenChange={() => toggleSubject(subject.id)}
              >
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <CollapsibleTrigger className="flex items-center gap-3 flex-1 cursor-pointer">
                    {expandedSubjects.has(subject.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{subject.name}</div>
                      {subject.description && (
                        <div className="text-sm text-muted-foreground">{subject.description}</div>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      <Layers className="h-3 w-3 mr-1" />
                      {subject._count?.systems || 0} systems
                    </Badge>
                  </CollapsibleTrigger>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        disabled={isDeleting === subject.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{subject.name}&quot;? This will
                          permanently delete all associated systems, marks, questions, and files. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(subject.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <CollapsibleContent>
                  <div className="ml-6 mt-3 pl-4 border-l-2 border-muted space-y-4">
                    {/* Featured Questions Section */}
                    <FeaturedQuestions 
                      subjectId={subject.id} 
                      subjectName={subject.name} 
                    />
                    
                    {/* Systems Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-4 w-4 text-blue-600" />
                        <h4 className="text-sm font-semibold">Systems</h4>
                      </div>
                      <SystemList subjectId={subject.id} onRefresh={onRefresh} />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
