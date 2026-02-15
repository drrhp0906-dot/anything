'use client';

import { useState, useEffect, useCallback } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SubjectList } from '@/components/dashboard/SubjectList';
import { DataPersistence } from '@/components/dashboard/DataPersistence';
import { AutoBackupCloud } from '@/components/dashboard/AutoBackupCloud';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, GraduationCap, Clock, FileQuestion, TrendingUp, Star, 
  Repeat, Calendar, HelpCircle
} from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count?: {
    systems: number;
  };
}

interface Stats {
  subjects: number;
  systems: number;
  marks: number;
  questions: number;
  files: number;
  folders: number;
  storage: number;
}

interface ImportanceStats {
  avgScore: number;
  highImportanceCount: number;
  criticalCount: number;
  repeatedQuestions: number;
  totalRepeats: number;
}

interface FeaturedQuestion {
  id: string;
  title: string;
  repeatCount: number;
  calculatedScore: number;
  globalImportance: number;
  yearsAppeared: string;
  marks: {
    value: number;
    system: {
      name: string;
      subject: {
        name: string;
      };
    };
  };
}

interface RecentQuestion {
  id: string;
  title: string;
  createdAt: string;
  repeatCount: number;
  calculatedScore: number;
  marks: {
    value: number;
    system: {
      name: string;
      subject: {
        name: string;
      };
    };
  };
}

function getImportanceColor(score: number): string {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
}

function getImportanceBadge(score: number): { label: string; className: string } {
  if (score >= 80) return { label: 'Critical', className: 'bg-red-100 text-red-700 border-red-200' };
  if (score >= 60) return { label: 'High', className: 'bg-orange-100 text-orange-700 border-orange-200' };
  if (score >= 40) return { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  return { label: 'Low', className: 'bg-green-100 text-green-700 border-green-200' };
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<Stats>({
    subjects: 0,
    systems: 0,
    marks: 0,
    questions: 0,
    files: 0,
    folders: 0,
    storage: 0,
  });
  const [importanceStats, setImportanceStats] = useState<ImportanceStats>({
    avgScore: 0,
    highImportanceCount: 0,
    criticalCount: 0,
    repeatedQuestions: 0,
    totalRepeats: 0,
  });
  const [featuredQuestions, setFeaturedQuestions] = useState<FeaturedQuestion[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [subjectsRes, statsRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/stats'),
      ]);

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.counts);
        setImportanceStats(statsData.importance);
        setRecentQuestions(statsData.recentActivity.questions);
        setFeaturedQuestions(statsData.featuredQuestions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                University Exam Database
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage subjects, systems, marks, questions, and files
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <StatsCards stats={stats} importance={importanceStats} />
        </div>

        {/* Hierarchy Info */}
        <Card className="mb-6 border-l-4 border-l-emerald-500">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-emerald-600">Structure:</span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Subject</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">System</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Marks</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Question</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Files</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subject List - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <SubjectList subjects={subjects} onRefresh={fetchData} />
          </div>

          {/* Sidebar - Recent Activity & Featured */}
          <div className="space-y-6">
            {/* Global Featured Questions */}
            {featuredQuestions.length > 0 && (
              <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-amber-700">
                    <Star className="h-4 w-4 fill-amber-500" />
                    Top Featured Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {featuredQuestions.slice(0, 5).map((q, index) => {
                      const badge = getImportanceBadge(q.calculatedScore);
                      return (
                        <div
                          key={q.id}
                          className="p-2 rounded-lg bg-white border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start gap-2">
                            {index < 3 && (
                              <Badge className="bg-amber-500 text-white text-xs shrink-0">
                                #{index + 1}
                              </Badge>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{q.title}</p>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <span className="truncate">{q.marks.system.subject.name}</span>
                                <span>/</span>
                                <span>{q.marks.system.name}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="outline" className={`text-xs ${badge.className}`}>
                                    {badge.label}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Repeat className="h-3 w-3" />
                                    {q.repeatCount}x
                                  </span>
                                </div>
                                <span className="text-xs font-medium">{q.calculatedScore.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Recent Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentQuestions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <FileQuestion className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No recent questions
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentQuestions.map((q) => {
                      const badge = getImportanceBadge(q.calculatedScore);
                      return (
                        <div
                          key={q.id}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <p className="font-medium text-sm truncate">{q.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {q.marks.system.subject.name} / {q.marks.system.name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs ${badge.className}`}>
                                {badge.label}
                              </Badge>
                              <span className="text-xs font-medium text-purple-600">
                                {q.marks.value} Marks
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(q.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Avg. Systems per Subject</span>
                    <span className="font-medium">
                      {stats.subjects > 0 ? (stats.systems / stats.subjects).toFixed(1) : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Avg. Marks per System</span>
                    <span className="font-medium">
                      {stats.systems > 0 ? (stats.marks / stats.systems).toFixed(1) : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Avg. Questions per Marks</span>
                    <span className="font-medium">
                      {stats.marks > 0 ? (stats.questions / stats.marks).toFixed(1) : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Avg. Files per Question</span>
                    <span className="font-medium">
                      {stats.questions > 0 ? (stats.files / stats.questions).toFixed(1) : '0'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Importance Score Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Importance Score Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="flex-1">Critical (80-100%)</span>
                    <span className="text-muted-foreground">Must study</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-500" />
                    <span className="flex-1">High (60-79%)</span>
                    <span className="text-muted-foreground">Important</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span className="flex-1">Medium (40-59%)</span>
                    <span className="text-muted-foreground">Should know</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="flex-1">Low (0-39%)</span>
                    <span className="text-muted-foreground">Optional</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  <p>Score = Repeat Count + Recency (past 5 years) + Topic Importance</p>
                </div>
              </CardContent>
            </Card>

            {/* Data Persistence Status */}
            <DataPersistence />

            {/* Auto Cloud Backup */}
            <AutoBackupCloud />
          </div>
        </div>
      </div>
    </div>
  );
}
