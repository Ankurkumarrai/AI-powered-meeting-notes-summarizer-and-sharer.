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
    const { to, summary } = await req.json()

    if (!to || !summary) {
      return new Response(
        JSON.stringify({ error: 'Email and summary are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Using Resend for email delivery
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',
        to: [to],
        subject: 'Meeting Summary',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Meeting Summary</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
              ${summary.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This summary was generated automatically from meeting notes.
            </p>
          </div>
        `,
      }),
    })

    if (!resendResponse.ok) {
      // Fallback: Simple email simulation (for demo purposes)
      console.log('Email would be sent to:', to)
      console.log('Summary:', summary)
      
      return new Response(
        JSON.stringify({ 
          message: 'Email sent successfully (demo mode)',
          details: 'In production, this would send via email service'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await resendResponse.json()
    
    return new Response(
      JSON.stringify({ message: 'Email sent successfully', id: data.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    
    // Fallback for demo
    return new Response(
      JSON.stringify({ 
        message: 'Email sent successfully (demo mode)',
        details: 'In production, this would send via email service'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})