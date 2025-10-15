'use client';

import { useState } from 'react';
import { Upload, FileCode, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeUploadForm from '@/components/CodeUploadForm';
import ReviewResults from '@/components/ReviewResults';
import ReviewHistory from '@/components/ReviewHistory';
import { CodeReview } from '@/lib/supabase';

export default function Home() {
  const [currentReview, setCurrentReview] = useState<CodeReview | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleReviewComplete = (review: CodeReview) => {
    setCurrentReview(review);
    setActiveTab('results');
  };

  const handleViewReview = (review: CodeReview) => {
    setCurrentReview(review);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <FileCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-3">
            Code Review Assistant
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            AI-powered code analysis for better software quality. Upload your code and get instant insights on structure, readability, and best practices.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-0">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Upload Code for Review</CardTitle>
                <CardDescription>
                  Submit your source code file to receive a comprehensive analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeUploadForm onReviewComplete={handleReviewComplete} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            {currentReview ? (
              <ReviewResults review={currentReview} />
            ) : (
              <Card className="border-0 shadow-xl">
                <CardContent className="py-12">
                  <div className="text-center text-slate-500">
                    <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No review results yet</p>
                    <p className="text-sm mt-2">Upload a code file to see the analysis</p>
                    <Button
                      onClick={() => setActiveTab('upload')}
                      className="mt-4"
                      variant="outline"
                    >
                      Go to Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Review History</CardTitle>
                <CardDescription>
                  Browse all previous code reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewHistory onViewReview={handleViewReview} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
