import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteData, url } = await req.json();

    if (!websiteData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Website data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing website:', url);

    const systemPrompt = `You are an expert website defect analyzer and software quality engineer. Your task is to analyze website content and identify potential defects, vulnerabilities, and issues.

Analyze the provided website content and return a comprehensive defect analysis in JSON format.

Categories of defects to look for:
1. **Security Vulnerabilities**: XSS risks, CSRF issues, insecure links, mixed content, exposed credentials
2. **Accessibility Issues**: Missing alt tags, poor contrast, no ARIA labels, keyboard navigation issues
3. **Performance Issues**: Large assets, unoptimized images, render-blocking resources, too many HTTP requests
4. **SEO Problems**: Missing meta tags, duplicate content, broken links, poor heading structure
5. **UX/UI Issues**: Poor navigation, confusing layouts, missing error handling, bad mobile responsiveness
6. **Code Quality**: Deprecated HTML/CSS, invalid markup, inline styles overuse, missing doctype
7. **Functionality Risks**: Broken forms, dead links, missing validation, incomplete features
8. **Future Risk Prediction**: Based on patterns, predict what issues may arise in the future

For each defect found, provide:
- Category
- Severity (critical, high, medium, low)
- Location (describe where in the website)
- Description of the issue
- Impact if not fixed
- Recommended fix/precaution

Also provide:
- Overall health score (0-100)
- Risk level (critical, high, medium, low)
- Top 5 priority fixes
- Preventive measures for future defects`;

    const userPrompt = `Analyze this website (${url}) for defects:

**HTML Content (truncated):**
${websiteData.html?.substring(0, 15000) || 'Not available'}

**Markdown Content:**
${websiteData.markdown?.substring(0, 10000) || 'Not available'}

**Links Found (${websiteData.links?.length || 0}):**
${JSON.stringify(websiteData.links?.slice(0, 50) || [], null, 2)}

**Page Metadata:**
${JSON.stringify(websiteData.metadata || {}, null, 2)}

Provide a comprehensive defect analysis with current issues, their locations, and preventive measures for future defects.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'website_defect_analysis',
              description: 'Return comprehensive website defect analysis',
              parameters: {
                type: 'object',
                properties: {
                  healthScore: { type: 'number', description: 'Overall health score 0-100' },
                  riskLevel: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
                  summary: { type: 'string', description: 'Brief summary of website health' },
                  defects: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        category: { type: 'string', enum: ['security', 'accessibility', 'performance', 'seo', 'ux', 'code-quality', 'functionality', 'future-risk'] },
                        severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
                        title: { type: 'string' },
                        location: { type: 'string' },
                        description: { type: 'string' },
                        impact: { type: 'string' },
                        fix: { type: 'string' },
                        isFuturePrediction: { type: 'boolean' }
                      },
                      required: ['id', 'category', 'severity', 'title', 'location', 'description', 'impact', 'fix', 'isFuturePrediction']
                    }
                  },
                  priorityFixes: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Top 5 priority fixes'
                  },
                  preventiveMeasures: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        importance: { type: 'string', enum: ['critical', 'high', 'medium'] }
                      },
                      required: ['title', 'description', 'importance']
                    }
                  },
                  metrics: {
                    type: 'object',
                    properties: {
                      securityScore: { type: 'number' },
                      accessibilityScore: { type: 'number' },
                      performanceScore: { type: 'number' },
                      seoScore: { type: 'number' },
                      codeQualityScore: { type: 'number' }
                    }
                  }
                },
                required: ['healthScore', 'riskLevel', 'summary', 'defects', 'priorityFixes', 'preventiveMeasures', 'metrics']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'website_defect_analysis' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits depleted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await response.json();
    console.log('AI response received');

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({ success: true, analysis }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback if no tool call
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to parse AI analysis' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing website:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
