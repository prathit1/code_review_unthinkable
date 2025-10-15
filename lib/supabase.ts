import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CodeReview {
  id: string;
  filename: string;
  code_content: string;
  language: string;
  review_result: {
    summary: string;
    score: string;
    strengths: string[];
    issues: Array<{
      severity: 'high' | 'medium' | 'low';
      category: string;
      description: string;
      suggestion: string;
    }>;
    recommendations: string[];
  };
  created_at: string;
  updated_at: string;
}
