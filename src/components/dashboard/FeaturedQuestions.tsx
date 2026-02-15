'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  Calendar, 
  Repeat,
  HelpCircle,
  FileText,
  Award
} from 'lucide-react';

interface FeaturedQuestion {
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
  marks: {
    id: string;
    value: number;
    systemId: string;
    system: {
      name: string;
      subjectId: string;
    };
  };
  _count?: {
    files: number;
  };
}

interface FeaturedQuestionsProps {
  subjectId: string;
  subjectName: string;
}

function getImportanceColor(score: number): string {
  if (score >= 80) return 'text-red-600 bg-red-50 border-red-200';
  if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-green-600 bg-green-50 border-green-200';
}

function getImportanceLabel(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function getRecentYears(yearsAppeared: string): number[] {
  const currentYear = new Date().getFullYear();
  const years = yearsAppeared
    .split(',')
    .map(y => parseInt(y.trim(), 10))
    .filter(y => !isNaN(y) && y >= currentYear - 5);
  return years.sort((a, b) => b - a);
}

export function FeaturedQuestions({ subjectId, subjectName }: FeaturedQuestionsProps) {
  const [questions, setQuestions] = useState<FeaturedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchFeaturedQuestions();
  }, [subjectId]);

  const fetchFeaturedQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions?subjectId=${subjectId}&featured=true`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching featured questions:', error);
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

  if (loading) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <Award className="h-5 w-5" />
            Featured Questions - {subjectName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading featured questions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return null; // Don't show if no questions
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-700">
          <Star className="h-5 w-5 fill-amber-500" />
          Featured Questions - Top {questions.length}
          <Badge variant="secondary" className="ml-auto bg-amber-100 text-amber-700">
            Past 5 Years Priority
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Top questions by importance score (repeat count + recency + topic importance)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {questions.map((question, index) => {
            const recentYears = getRecentYears(question.yearsAppeared);
            const importanceColor = getImportanceColor(question.calculatedScore);
            const importanceLabel = getImportanceLabel(question.calculatedScore);
            
            return (
              <Collapsible
                key={question.id}
                open={expandedQuestions.has(question.id)}
                onOpenChange={() => toggleQuestion(question.id)}
              >
                <div className={`p-3 rounded-lg border bg-white hover:shadow-md transition-all ${
                  index < 3 ? 'border-amber-300 shadow-sm' : 'border-gray-200'
                }`}>
                  <CollapsibleTrigger className="flex items-start gap-3 w-full cursor-pointer">
                    {expandedQuestions.has(question.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {index < 3 && (
                              <Badge className="bg-amber-500 text-white text-xs">
                                #{index + 1}
                              </Badge>
                            )}
                            <span className="font-medium text-sm truncate">{question.title}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <HelpCircle className="h-3 w-3" />
                              {question.marks.system.name}
                            </span>
                            <span>•</span>
                            <span className="font-medium text-purple-600">
                              {question.marks.value} Marks
                            </span>
                          </div>
                        </div>
                        
                        <Badge className={`text-xs ${importanceColor} border shrink-0`}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {importanceLabel} ({question.calculatedScore.toFixed(0)})
                        </Badge>
                      </div>
                      
                      {/* Score breakdown bar */}
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Repeat className="h-3 w-3" />
                          <span>{question.repeatCount}x repeated</span>
                          {recentYears.length > 0 && (
                            <>
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              <span>{recentYears.join(', ')}</span>
                            </>
                          )}
                        </div>
                        <Progress 
                          value={question.calculatedScore} 
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="mt-3 pt-3 border-t text-sm">
                      {question.content && (
                        <div className="mb-2">
                          <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
                        </div>
                      )}
                      
                      {question.terminologies && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-md mb-2">
                          <h6 className="text-xs font-semibold text-amber-800 flex items-center gap-1 mb-1">
                            <Star className="h-3 w-3" />
                            Important Terminologies:
                          </h6>
                          <p className="text-amber-900 whitespace-pre-wrap">{question.terminologies}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {question.repeatCount} times repeated
                        </Badge>
                        {question.yearsAppeared && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Years: {question.yearsAppeared}
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Topic Importance: {question.globalImportance}%
                        </Badge>
                        {question._count?.files && question._count.files > 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {question._count.files} files
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
