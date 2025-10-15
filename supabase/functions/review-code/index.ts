import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ReviewRequest {
  filename: string;
  code: string;
  language?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { filename, code, language }: ReviewRequest = await req.json();

    if (!filename || !code) {
      return new Response(
        JSON.stringify({ error: "Filename and code are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ Load environment variables safely
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("Missing Gemini API key. Please set GEMINI_API_KEY in environment variables.");
    }

    const model = "gemini-2.5-flash";  // or another valid model you see from list
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;


    // Prepare prompt
    const prompt = `You are an expert code reviewer. Analyze the following ${language || "code"} for:
1. Code structure and organization
2. Readability and maintainability
3. Best practices and design patterns
4. Potential bugs and security issues
5. Performance considerations
6. Code complexity

Provide a detailed review with specific improvement suggestions. Format your response as JSON with the following structure:
{
  "summary": "Brief overview of code quality",
  "score": "Overall score out of 10",
  "strengths": ["list of positive aspects"],
  "issues": [
    {
      "severity": "high/medium/low",
      "category": "readability/performance/security/best-practices/bugs",
      "description": "detailed description",
      "suggestion": "how to fix it"
    }
  ],
  "recommendations": ["list of general recommendations"]
}

Code to review:

Filename: ${filename}

\`\`\`
${code}
\`\`\``;

    // Call Gemini API
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${geminiResponse.statusText} - ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    const reviewText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reviewText) {
      throw new Error("No review generated from Gemini API");
    }

    // Try to extract JSON from Gemini response
    let reviewResult;
    try {
      const jsonMatch = reviewText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reviewResult = JSON.parse(jsonMatch[0]);
      } else {
        reviewResult = {
          summary: reviewText,
          score: "N/A",
          strengths: [],
          issues: [],
          recommendations: [],
        };
      }
    } catch {
      reviewResult = {
        summary: reviewText,
        score: "N/A",
        strengths: [],
        issues: [],
        recommendations: [],
      };
    }

    // ✅ Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Save review to Supabase
    const { data: savedReview, error: dbError } = await supabase
      .from("code_reviews")
      .insert({
        filename,
        code_content: code,
        language: language || "unknown",
        review_result: reviewResult,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save review: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        review: savedReview,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});