export default {
  async fetch(req, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    try {
      // A chave deve ser configurada como secret do Worker: RESEND_API_KEY
      // Em Cloudflare Workers (módulo), os secrets ficam em env.SECRET_NAME
      const RESEND_API_KEY = env?.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined);
      if (!RESEND_API_KEY) {
        return new Response(JSON.stringify({ success: false, error: 'RESEND_API_KEY not set' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      let to = [];
      let subject = '';
      let html = '';
      let attachments = [];

      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const body = await req.json();
        to = Array.isArray(body.to) ? body.to : [];
        subject = body.subject || '';
        html = body.content || body.html || '';
        attachments = (body.attachments || []).map(att => ({
          filename: att.filename,
          content: (att.content || '').replace(/^data:.*?;base64,/, ''), // remove prefix se vier DataURL
        }));
      } else if (contentType.includes('multipart/form-data')) {
        const fd = await req.formData();
        subject = (fd.get('subject') || '').toString();
        html = (fd.get('message') || '').toString();
        const toField = (fd.get('to') || '').toString();
        to = toField ? toField.split(',').map(s => s.trim()).filter(Boolean) : [];

        const files = fd.getAll('files[]');
        for (const file of files) {
          const buf = await file.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
          attachments.push({
            filename: file.name || 'arquivo',
            content: base64,
          });
        }
      } else {
        return new Response(JSON.stringify({ success: false, error: 'Unsupported content type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const payload = {
        from: 'Cotação Site Feijó <onboarding@resend.dev>',
        to,
        subject,
        html,
        attachments: attachments.length ? attachments : undefined,
      };

      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await resp.json();
      if (!resp.ok) {
        return new Response(JSON.stringify({ success: false, error: result?.message || 'Resend error' }), {
          status: resp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data: result }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}