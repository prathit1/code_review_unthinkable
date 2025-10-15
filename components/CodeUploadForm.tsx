'use client';

import { useState, useRef } from 'react';
import { Upload, FileCode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CodeReview } from '@/lib/supabase';

interface CodeUploadFormProps {
  onReviewComplete: (review: CodeReview) => void;
}

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'other',
];

export default function CodeUploadForm({ onReviewComplete }: CodeUploadFormProps) {
  const [code, setCode] = useState('');
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
    };
    reader.readAsText(file);

    const ext = file.name.split('.').pop()?.toLowerCase();
    const langMap: { [key: string]: string } = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      cc: 'cpp',
      cs: 'csharp',
      go: 'go',
      rs: 'rust',
      php: 'php',
      rb: 'ruby',
      swift: 'swift',
      kt: 'kotlin',
    };
    if (ext && langMap[ext]) {
      setLanguage(langMap[ext]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide code to review',
        variant: 'destructive',
      });
      return;
    }

    if (!filename.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a filename',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const apiUrl = `${supabaseUrl}/functions/v1/review-code`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          filename,
          code,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to review code');
      }

      const data = await response.json();

      toast({
        title: 'Success',
        description: 'Code review completed successfully',
      });

      onReviewComplete(data.review);
      setCode('');
      setFilename('');
      setLanguage('javascript');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to review code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Upload File</Label>
        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.cs,.go,.rs,.php,.rb,.swift,.kt,.c,.h,.hpp,.cc"
            onChange={handleFileUpload}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filename">Filename</Label>
        <Input
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="e.g., app.js"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Programming Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Code Content</Label>
        <Textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here or upload a file..."
          className="font-mono text-sm min-h-[300px]"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Code...
          </>
        ) : (
          <>
            <FileCode className="w-4 h-4 mr-2" />
            Review Code
          </>
        )}
      </Button>
    </form>
  );
}
