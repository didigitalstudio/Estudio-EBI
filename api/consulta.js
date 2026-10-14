import { buildInquiry } from './_consulta.js';

// Consultas del formulario por email, con Resend.
// Requiere en Vercel: RESEND_API_KEY y CONSULTAS_EMAIL. Sin eso la página manda la consulta por WhatsApp.
export default async function handler(req, res) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONSULTAS_EMAIL;
  const configured = Boolean(key && to);

  // La página pregunta al cargar si el envío por email está activo
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json({ configured });
  }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }
  if (!configured) return res.status(503).json({ configured: false });

  let body = null;
  try {
    body = req.body;
  } catch {
    // JSON mal formado
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Consulta inválida' });
  // Campo trampa: las personas no lo ven, los bots lo completan. Respondemos ok sin enviar nada.
  if (body.website) return res.status(200).json({ ok: true });

  const inquiry = buildInquiry(body);
  if (inquiry.error) return res.status(400).json({ error: inquiry.error });

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONSULTAS_FROM || 'Web Estudio EBI <onboarding@resend.dev>',
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: inquiry.replyTo,
        subject: inquiry.subject,
        text: inquiry.text,
      }),
    });
    if (!r.ok) throw new Error(`resend ${r.status}`);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(502).json({ error: 'No se pudo enviar la consulta' });
  }
}
