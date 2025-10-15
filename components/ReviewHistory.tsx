'use client';

import { useEffect, useState } from 'react';
import { FileCode, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, CodeReview } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ReviewHistoryProps {
  onViewReview: (review: CodeReview) => void;
}

export default function ReviewHistory({ onViewReview }: ReviewHistoryProps) {
  const [reviews, setReviews] = useState<CodeReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('code_reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load review history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return 'bg-slate-100 text-slate-700';
    if (numScore >= 8) return 'bg-green-100 text-green-700';
    if (numScore >= 6) return 'bg-blue-100 text-blue-700';
    if (numScore >= 4) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No reviews yet</p>
        <p className="text-sm mt-2">Upload your first code file to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileCode className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{review.filename}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <Badge variant="outline" className="capitalize">
                  {review.language}
                </Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getScoreColor(review.review_result.score)} border-0`}>
              Score: {review.review_result.score}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewReview(review)}
              className="flex items-center gap-1"
            >
              View
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
