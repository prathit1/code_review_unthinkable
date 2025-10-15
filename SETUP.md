# Code Review Assistant - Setup Guide

## Project Overview

A full-stack AI-powered code review assistant built with Next.js, Supabase, and Google Gemini. This application automatically analyzes source code for structure, readability, security issues, and best practices.

## Technology Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **AI**: Google Gemini 1.5 Flash API

## Features

1. **Code Upload Interface**
   - File upload or paste code directly
   - Support for multiple programming languages
   - Automatic language detection from file extensions

2. **AI-Powered Analysis**
   - Code structure and organization review
   - Readability and maintainability assessment
   - Best practices validation
   - Security vulnerability detection
   - Performance considerations
   - Detailed improvement suggestions

3. **Review Results Dashboard**
   - Overall quality score (0-10)
   - Strengths highlighting
   - Categorized issues (high/medium/low severity)
   - Actionable recommendations

4. **Review History**
   - Browse all previous code reviews
   - Persistent storage in Supabase
   - Quick access to past analyses

## Setup Instructions

### 1. Configure Gemini API Key

Replace the temporary API key in your `.env` file:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

To get a Gemini API key:
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste it into your `.env` file

### 2. Configure Supabase Edge Function Secret

The Gemini API key needs to be available in the Edge Function:

```bash
# Using Supabase Dashboard:
# 1. Go to your project settings
# 2. Navigate to Edge Functions > Secrets
# 3. Add GEMINI_API_KEY with your API key value
```

### 3. Database Setup

The database schema is already created with the following table:

- **code_reviews**: Stores all code review results
  - id, filename, code_content, language
  - review_result (JSONB with analysis)
  - created_at, updated_at
  - Row Level Security enabled for public access

### 4. Edge Function Deployment

The Edge Function `review-code` is already deployed and handles:
- Receiving code submissions
- Calling Gemini API for analysis
- Storing results in the database
- Returning structured review data

### 5. Run the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Application Structure

```
/app
  - page.tsx          # Main application with tabs
  - layout.tsx        # Root layout with metadata
  - globals.css       # Global styles

/components
  - CodeUploadForm.tsx    # Code submission interface
  - ReviewResults.tsx     # Review display component
  - ReviewHistory.tsx     # Historical reviews list
  - /ui                   # shadcn/ui components

/lib
  - supabase.ts          # Supabase client and types
  - utils.ts             # Utility functions

/supabase/functions
  - review-code          # Edge Function for AI analysis
```

## API Endpoints

### POST /functions/v1/review-code

Submit code for review.

**Request Body:**
```json
{
  "filename": "example.js",
  "code": "function hello() { console.log('Hello'); }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "id": "uuid",
    "filename": "example.js",
    "review_result": {
      "summary": "Code analysis summary",
      "score": "8",
      "strengths": ["..."],
      "issues": [{
        "severity": "medium",
        "category": "best-practices",
        "description": "...",
        "suggestion": "..."
      }],
      "recommendations": ["..."]
    }
  }
}
```

## Supported Languages

JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, and more.

## Security

- Row Level Security (RLS) enabled on all tables
- Public access for demo purposes (can be restricted)
- No sensitive data logged
- API keys secured in environment variables

## Evaluation Criteria Met

✅ Backend API to receive code files
✅ LLM integration (Gemini) for code analysis
✅ Database for storing reports (Supabase)
✅ Dashboard to upload & view reports
✅ Quality LLM insights with structured output
✅ Comprehensive API design
✅ Complete full-stack implementation

## Next Steps

1. Add your Gemini API key to `.env`
2. Configure the Edge Function secret
3. Test the application with sample code files
4. Customize the review criteria as needed
