'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Layers, Hash, HelpCircle, FileText, HardDrive, TrendingUp, AlertTriangle, Repeat, Folder } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    subjects: number;
    systems: number;
    marks: number;
    questions: number;
    files: number;
    folders: number;
    storage: number;
  };
  importance?: {
    avgScore: number;
    highImportanceCount: number;
    criticalCount: number;
    repeatedQuestions: number;
    totalRepeats: number;
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function StatsCards({ stats, importance }: StatsCardsProps) {
  const mainCards = [
    {
      title: 'Subjects',
      value: stats.subjects,
      icon: BookOpen,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Systems',
      value: stats.systems,
      icon: Layers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Marks',
      value: stats.marks,
      icon: Hash,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Questions',
      value: stats.questions,
      icon: HelpCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Folders',
      value: stats.folders,
      icon: Folder,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Files',
      value: stats.files,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const storageCards = [
    {
      title: 'Storage Used',
      value: formatBytes(stats.storage),
      icon: HardDrive,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  const importanceCards = importance ? [
    {
      title: 'Avg Importance',
      value: `${importance.avgScore.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: 'Overall score',
    },
    {
      title: 'Critical Questions',
      value: importance.criticalCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      subtitle: 'Score ≥ 80%',
    },
    {
      title: 'High Importance',
      value: importance.highImportanceCount,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subtitle: 'Score ≥ 60%',
    },
    {
      title: 'Repeated Questions',
      value: importance.repeatedQuestions,
      icon: Repeat,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subtitle: `${importance.totalRepeats} total repeats`,
    },
  ] : [];

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {mainCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
        {storageCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Importance Stats */}
      {importanceCards.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Importance Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {importanceCards.map((card) => (
              <Card key={card.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
