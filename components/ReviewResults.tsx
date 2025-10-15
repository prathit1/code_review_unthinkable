'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, AlertCircle, XCircle, Lightbulb, Code2 } from 'lucide-react';
import { CodeReview } from '@/lib/supabase';

interface ReviewResultsProps {
  review: CodeReview;
}

const severityConfig = {
  high: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badge: 'destructive' as const,
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    badge: 'default' as const,
  },
  low: {
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    badge: 'secondary' as const,
  },
};

export default function ReviewResults({ review }: ReviewResultsProps) {
  const { filename, language, review_result, created_at } = review;

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return 'text-slate-500';
    if (numScore >= 8) return 'text-green-600';
    if (numScore >= 6) return 'text-blue-600';
    if (numScore >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Code2 className="w-6 h-6" />
                {filename}
              </CardTitle>
              <CardDescription>
                {language.charAt(0).toUpperCase() + language.slice(1)} • Reviewed on{' '}
                {new Date(created_at).toLocaleString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">Overall Score</div>
              <div className={`text-4xl font-bold ${getScoreColor(review_result.score)}`}>
                {review_result.score}
                {!isNaN(parseFloat(review_result.score)) && <span className="text-xl">/10</span>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-slate-700">
              {review_result.summary}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {review_result.strengths && review_result.strengths.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review_result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {review_result.issues && review_result.issues.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Issues Found ({review_result.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {review_result.issues.map((issue, index) => {
              const config = severityConfig[issue.severity] || severityConfig.low;
              const Icon = config.icon;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className="font-semibold text-slate-800">
                        {issue.category.split('-').map(word =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                    <Badge variant={config.badge} className="capitalize">
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="text-slate-700 mb-3">{issue.description}</p>
                  <Separator className="my-3" />
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-blue-900">Suggestion: </span>
                      <span className="text-sm text-slate-700">{issue.suggestion}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {review_result.recommendations && review_result.recommendations.length > 0 && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Lightbulb className="w-5 h-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review_result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
