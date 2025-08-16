import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { transcript, prompt } = await req.json()

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: 'Transcript is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that creates meeting summaries. Generate clear, structured summaries based on the provided instructions.'
          },
          {
            role: 'user',
            content: `Please create a summary of this meeting transcript based on the following instructions: "${prompt || 'Create a comprehensive summary'}"\n\nTranscript:\n${transcript}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    })

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text()
      console.error('OpenAI API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to generate summary' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await openAIResponse.json()
    const summary = data.choices[0]?.message?.content

    return new Response(
      JSON.stringify({ summary }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})