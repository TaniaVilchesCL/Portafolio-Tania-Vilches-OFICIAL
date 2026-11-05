/// <reference types="@cloudflare/workers-types" />
// POST /api/contact — Cloudflare Pages Function.
// Valida y sanea, descarta bots, limita por IP, guarda en D1 y envía el correo con Resend.

interface Env {
  DB: D1Database;
  RESEND_API_KEY?: string;
  MAIL_TO?: string;
  MAIL_FROM?: string;
  TURNSTILE_SECRET?: string;
  IP_SALT?: string;
  ALLOWED_ORIGIN?: string;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const clean = (v: unknown): string => (typeof v === 'string' ? v.replace(CONTROL_CHARS, '').trim() : '');
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function hashIp(ip: string, salt: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!token) return false;
  try {
    const form = new FormData();
    form.append('secret', secret);
    form.append('response', token);
    form.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    return ((await r.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}

async function sendEmail(env: Env, name: string, email: string, message: string, lang: string): Promise<boolean> {
  // Nunca simula éxito: sin credenciales devuelve false y el mensaje queda como "mail_failed" en D1.
  if (!env.RESEND_API_KEY || !env.MAIL_TO) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: env.MAIL_FROM || 'Portafolio <onboarding@resend.dev>',
        to: [env.MAIL_TO],
        reply_to: email,
        subject: `[Portafolio] Mensaje de ${name.slice(0, 60)}`,
        html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt; (${lang})</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
        text: `${name} <${email}> (${lang})\n\n${message}`,
      }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (env.ALLOWED_ORIGIN && request.headers.get('Origin') !== env.ALLOWED_ORIGIN) return json({ code: 'forbidden' }, 403);

  const raw = await request.text();
  if (raw.length > 10_000) return json({ code: 'payload_too_large' }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (typeof body !== 'object' || body === null || Array.isArray(body)) throw new Error();
  } catch {
    return json({ code: 'invalid' }, 400);
  }

  if (clean(body.website)) return json({ ok: true }, 201); // honeypot: los bots lo llenan; no guardamos nada

  const name = clean(body.name).replace(/\s+/g, ' '); // sin saltos de línea: va en el asunto del correo
  const email = clean(body.email).toLowerCase();
  const message = clean(body.message);
  const lang = body.lang === 'en' ? 'en' : 'es';
  if (name.length < 2 || name.length > 80 || email.length > 254 || !EMAIL_RE.test(email) || message.length < 10 || message.length > 2000) {
    return json({ code: 'invalid' }, 422);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (env.TURNSTILE_SECRET && !(await verifyTurnstile(env.TURNSTILE_SECRET, clean(body.turnstile_token), ip))) {
    return json({ code: 'captcha_failed' }, 400);
  }

  const ipHash = await hashIp(ip, env.IP_SALT ?? 'change-me'); // guardamos solo un hash con sal, no la IP
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const recent = await env.DB.prepare('SELECT COUNT(*) AS c FROM messages WHERE ip_hash = ? AND created_at > ?').bind(ipHash, since).first<{ c: number }>();
  if ((recent?.c ?? 0) >= RATE_LIMIT_MAX) return json({ code: 'rate_limited' }, 429);

  const res = await env.DB.prepare('INSERT INTO messages (created_at, name, email, message, lang, ip_hash) VALUES (?,?,?,?,?,?)')
    .bind(new Date().toISOString(), name, email, message, lang, ipHash)
    .run();
  const id = res.meta.last_row_id;

  const sent = await sendEmail(env, name, email, message, lang);
  await env.DB.prepare('UPDATE messages SET status = ? WHERE id = ?').bind(sent ? 'sent' : 'mail_failed', id).run();
  return sent ? json({ ok: true }, 201) : json({ code: 'mail_failed' }, 502);
};
