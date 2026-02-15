'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Plus, Trash2, ChevronDown, ChevronRight, HelpCircle, FileText, StickyNote,
  Edit3, Repeat, Calendar, Star, TrendingUp, Save
} from 'lucide-react';
import { FileUpload } from './FileUpload';
import { FolderList } from './FolderList';

interface Question {
  id: string;
  title: string;
  content: string | null;
  terminologies: string | null;
  repeatCount: number;
  yearsAppeared: string;
  lastAppearedYear: number | null;
  globalImportance: number;
  calculatedScore: number;
  createdAt: string;
  _count?: {
    files: number;
  };
}

interface QuestionListProps {
  marksId: string;
  onRefresh: () => void;
}

function getImportanceColor(score: number): string {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
}

function getImportanceLabel(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

export function QuestionList({ marksId, onRefresh }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    terminologies: '',
    repeatCount: 1,
    yearsAppeared: '',
    globalImportance: 50
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [marksId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions?marksId=${marksId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, marksId }),
      });

      if (response.ok) {
        setFormData({ 
          title: '', 
          content: '', 
          terminologies: '',
          repeatCount: 1,
          yearsAppeared: '',
          globalImportance: 50
        });
        setDialogOpen(false);
        fetchQuestions();
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating question:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      content: question.content || '',
      terminologies: question.terminologies || '',
      repeatCount: question.repeatCount,
      yearsAppeared: question.yearsAppeared,
      globalImportance: question.globalImportance
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingQuestion || !formData.title.trim()) return;

    setIsEditing(editingQuestion.id);
    try {
      const response = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingQuestion.id,
          title: formData.title,
          content: formData.content,
          terminologies: formData.terminologies,
          repeatCount: formData.repeatCount,
          yearsAppeared: formData.yearsAppeared,
          globalImportance: formData.globalImportance
        }),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setEditingQuestion(null);
        fetchQuestions();
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating question:', error);
    } finally {
      setIsEditing(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/questions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchQuestions();
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="py-3 text-center text-xs text-muted-foreground">
        Loading questions...
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
          <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
          Questions
        </h5>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>
                Add a new exam question with repeat tracking and importance settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="questionTitle">Question Title *</Label>
                <Input
                  id="questionTitle"
                  placeholder="Enter a brief title for the question"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionContent">Question Content</Label>
                <Textarea
                  id="questionContent"
                  placeholder="Enter the full question content..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terminologies">
                  <span className="flex items-center gap-1.5">
                    <StickyNote className="h-4 w-4" />
                    Important Terminologies / Notes
                  </span>
                </Label>
                <Textarea
                  id="terminologies"
                  placeholder="Add important terms, notes, or key points..."
                  value={formData.terminologies}
                  onChange={(e) => setFormData({ ...formData, terminologies: e.target.value })}
                  rows={3}
                />
              </div>
              
              {/* Repeat Tracking Section */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Importance Tracking
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="repeatCount" className="flex items-center gap-1.5">
                      <Repeat className="h-3.5 w-3.5" />
                      Times Repeated
                    </Label>
                    <Input
                      id="repeatCount"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.repeatCount}
                      onChange={(e) => setFormData({ ...formData, repeatCount: parseInt(e.target.value) || 1 })}
                    />
                    <p className="text-xs text-muted-foreground">How many times this question has appeared in exams</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="globalImportance" className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5" />
                      Topic Importance
                    </Label>
                    <Input
                      id="globalImportance"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="50"
                      value={formData.globalImportance}
                      onChange={(e) => setFormData({ ...formData, globalImportance: Math.min(100, Math.max(0, parseInt(e.target.value) || 50)) })}
                    />
                    <p className="text-xs text-muted-foreground">Overall importance of this topic (0-100)</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="yearsAppeared" className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Years Appeared
                  </Label>
                  <Input
                    id="yearsAppeared"
                    placeholder="e.g., 2019, 2021, 2023"
                    value={formData.yearsAppeared}
                    onChange={(e) => setFormData({ ...formData, yearsAppeared: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated years when this question appeared</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating || !formData.title.trim()}>
                {isCreating ? 'Creating...' : 'Create Question'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-3 text-xs text-muted-foreground">
          No questions yet. Add your first question.
        </div>
      ) : (
        <div className="space-y-1">
          {questions.map((question) => (
            <Collapsible
              key={question.id}
              open={expandedQuestions.has(question.id)}
              onOpenChange={() => toggleQuestion(question.id)}
            >
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors bg-muted/30">
                <CollapsibleTrigger className="flex items-center gap-2 flex-1 cursor-pointer">
                  {expandedQuestions.has(question.id) ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm truncate block">{question.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Repeat className="h-2.5 w-2.5" />
                        {question.repeatCount}x
                      </span>
                      {question.yearsAppeared && (
                        <span className="text-xs text-muted-foreground">
                          ({question.yearsAppeared})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getImportanceColor(question.calculatedScore)} text-white border-0`}
                    >
                      {getImportanceLabel(question.calculatedScore)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {question._count?.files || 0}
                    </Badge>
                  </div>
                </CollapsibleTrigger>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-blue-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(question);
                    }}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        disabled={isDeleting === question.id}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Question</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this question? All associated files will
                          also be deleted. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(question.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CollapsibleContent>
                <div className="ml-3 mt-1 p-3 border rounded-md bg-background">
                  {/* Importance Score Bar */}
                  <div className="mb-3 p-2 bg-slate-50 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Importance Score</span>
                      <span className="text-xs font-bold">{question.calculatedScore.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={question.calculatedScore} 
                      className={`h-2 ${getImportanceColor(question.calculatedScore)}`}
                    />
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span>Repeat: {question.repeatCount}x</span>
                      <span>Years: {question.yearsAppeared || 'N/A'}</span>
                      <span>Topic: {question.globalImportance}%</span>
                    </div>
                  </div>

                  {question.content && (
                    <div className="mb-3">
                      <h6 className="text-xs font-semibold mb-1 text-muted-foreground">Content:</h6>
                      <p className="text-sm whitespace-pre-wrap">{question.content}</p>
                    </div>
                  )}
                  {question.terminologies && (
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
                      <h6 className="text-xs font-semibold mb-1 text-amber-800 flex items-center gap-1">
                        <StickyNote className="h-3 w-3" />
                        Important Terminologies:
                      </h6>
                      <p className="text-sm text-amber-900 whitespace-pre-wrap">{question.terminologies}</p>
                    </div>
                  )}
                  
                  {/* Quick Attachments */}
                  <div className="mb-3">
                    <FileUpload questionId={question.id} onRefresh={fetchQuestions} />
                  </div>
                  
                  {/* Reference Folders Section */}
                  <div className="border-t pt-3 mt-3">
                    <FolderList questionId={question.id} onRefresh={fetchQuestions} />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edit Question
            </DialogTitle>
            <DialogDescription>
              Update the question details and importance tracking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Question Title *</Label>
              <Input
                id="editTitle"
                placeholder="Enter a brief title for the question"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editContent">Question Content</Label>
              <Textarea
                id="editContent"
                placeholder="Enter the full question content..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTerminologies">
                <span className="flex items-center gap-1.5">
                  <StickyNote className="h-4 w-4" />
                  Important Terminologies / Notes
                </span>
              </Label>
              <Textarea
                id="editTerminologies"
                placeholder="Add important terms, notes, or key points..."
                value={formData.terminologies}
                onChange={(e) => setFormData({ ...formData, terminologies: e.target.value })}
                rows={3}
              />
            </div>
            
            {/* Repeat Tracking Section */}
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Importance Tracking
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editRepeatCount" className="flex items-center gap-1.5">
                    <Repeat className="h-3.5 w-3.5" />
                    Times Repeated
                  </Label>
                  <Input
                    id="editRepeatCount"
                    type="number"
                    min="1"
                    value={formData.repeatCount}
                    onChange={(e) => setFormData({ ...formData, repeatCount: parseInt(e.target.value) || 1 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editGlobalImportance" className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" />
                    Topic Importance (0-100)
                  </Label>
                  <Input
                    id="editGlobalImportance"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.globalImportance}
                    onChange={(e) => setFormData({ ...formData, globalImportance: Math.min(100, Math.max(0, parseInt(e.target.value) || 50)) })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editYearsAppeared" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Years Appeared (comma-separated)
                </Label>
                <Input
                  id="editYearsAppeared"
                  placeholder="e.g., 2019, 2021, 2023"
                  value={formData.yearsAppeared}
                  onChange={(e) => setFormData({ ...formData, yearsAppeared: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isEditing === editingQuestion?.id || !formData.title.trim()}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing === editingQuestion?.id ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
