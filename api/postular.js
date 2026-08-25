/**
 * ════════════════════════════════════════════════════════════════════
 *  Grupo Arvor · Puente de postulaciones hacia PeopleForce
 *  Ubicación en el repo: api/postular.js   (crear la carpeta "api")
 *
 *  Recibe la postulación desde grupoarvor.com.ar y la envía a PeopleForce
 *  con la Company API key, que vive como variable de entorno en Vercel
 *  y NUNCA viaja al navegador.
 *
 *  Variables de entorno a cargar en Vercel:
 *    PEOPLEFORCE_COMPANY_KEY = <la Company API key>          (obligatoria)
 *    PEOPLEFORCE_SOURCE_ID   = <id de la fuente "WebSite">   (opcional)
 *  (Vercel → Project → Settings → Environment Variables)
 *
 *  Si no cargás PEOPLEFORCE_SOURCE_ID, la función busca sola la fuente
 *  llamada "WebSite" en PeopleForce y la reutiliza en las siguientes
 *  postulaciones. Así el candidato queda registrado con origen Sitio Web.
 *
 *  No requiere instalar dependencias ni package.json.
 * ════════════════════════════════════════════════════════════════════ */

export const config = { runtime: 'edge' };

const PF_BASE = 'https://app.peopleforce.io/api/public/v3';

// PeopleForce rechaza el ISO con milisegundos. Formato aceptado: "YYYY-MM-DD HH:MM:SS"
function fechaPF(d) {
  const p = n => String(n).padStart(2, '0');
  return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate()) +
         ' ' + p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds());
}
// Alternativa por si el validador sólo acepta la fecha
function soloFecha(d) {
  const p = n => String(n).padStart(2, '0');
  return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate());
}

// Nombres aceptados para la fuente del candidato (sin distinguir mayúsculas)
const NOMBRES_FUENTE = ['website', 'web site', 'sitio web', 'página web', 'pagina web'];

// Cache en memoria: se resuelve una vez y se reutiliza mientras la función esté tibia
let fuenteCache = null;

async function obtenerFuenteId(KEY) {
  if (process.env.PEOPLEFORCE_SOURCE_ID) return process.env.PEOPLEFORCE_SOURCE_ID;
  if (fuenteCache !== null) return fuenteCache;
  try {
    const r = await fetch(PF_BASE + '/recruitment/sources', {
      headers: { 'X-API-KEY': KEY, 'Accept': 'application/json' }
    });
    if (!r.ok) return null;
    const j = await r.json();
    const lista = Array.isArray(j) ? j : (j.data || []);
    const hit = lista.find(f => NOMBRES_FUENTE.includes(String(f.name || '').trim().toLowerCase()));
    fuenteCache = hit ? hit.id : null;
    if (!hit) {
      console.warn('No se encontró la fuente WebSite. Fuentes disponibles:',
        lista.map(f => f.name).join(' | '));
    }
    return fuenteCache;
  } catch (e) {
    console.error('PF sources', e);
    return null;
  }
}

// Dominios autorizados a postular
const ORIGENES = [
  'https://www.grupoarvor.com.ar',
  'https://grupoarvor.com.ar',
  'https://grupoarvor.vercel.app'
];

function cabeceras(origin) {
  const permitido = ORIGENES.includes(origin) ? origin : ORIGENES[0];
  return {
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function responder(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: cabeceras(origin) });
}

export default async function handler(req) {
  const origin = req.headers.get('origin') || '';

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cabeceras(origin) });
  }
  if (req.method !== 'POST') {
    return responder({ ok: false, error: 'method_not_allowed' }, 405, origin);
  }

  const KEY = process.env.PEOPLEFORCE_COMPANY_KEY;
  if (!KEY) {
    return responder({
      ok: false, error: 'config',
      detalle: 'Falta la variable PEOPLEFORCE_COMPANY_KEY en Vercel, o no se redesplegó después de cargarla.'
    }, 500, origin);
  }

  let entrada;
  try {
    entrada = await req.formData();
  } catch (e) {
    return responder({ ok: false, error: 'formato_invalido' }, 400, origin);
  }

  // ── Campos que llegan del formulario ─────────────────────────────
  const nombre    = (entrada.get('nombre')    || '').toString().trim();
  const email     = (entrada.get('email')     || '').toString().trim();
  const telefono  = (entrada.get('telefono')  || '').toString().trim();
  const linkedin  = (entrada.get('linkedin')  || '').toString().trim();
  const mensaje   = (entrada.get('mensaje')   || '').toString().trim();
  const puesto    = (entrada.get('puesto')    || '').toString().trim();
  const vacanteId = (entrada.get('vacante_id')|| '').toString().trim();
  const futuras   = (entrada.get('futuras')   || '').toString() === 'si';
  const cv        = entrada.get('cv');
  const trampa    = (entrada.get('website')   || '').toString().trim(); // honeypot anti-bots

  // ── Validaciones ─────────────────────────────────────────────────
  if (trampa) return responder({ ok: true }, 200, origin); // bot: respondemos ok y descartamos
  if (!nombre) return responder({ ok: false, error: 'nombre_requerido' }, 422, origin);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return responder({ ok: false, error: 'email_invalido' }, 422, origin);
  }
  if (!cv || typeof cv === 'string' || !cv.name) {
    return responder({ ok: false, error: 'cv_requerido' }, 422, origin);
  }
  if (cv.size > 4 * 1024 * 1024) {
    return responder({ ok: false, error: 'cv_muy_grande' }, 422, origin);
  }
  const ext = cv.name.toLowerCase().split('.').pop();
  if (!['pdf', 'doc', 'docx'].includes(ext)) {
    return responder({ ok: false, error: 'cv_formato' }, 422, origin);
  }

  const ahora = new Date();
  const fuenteId = await obtenerFuenteId(KEY);

  // ── 1 · Crear el candidato en PeopleForce ────────────────────────
  function armarCuerpo(marcaTemporal) {
    const pf = new FormData();
    pf.append('full_name', nombre);
    pf.append('email', email);
    if (telefono) pf.append('phone_numbers[]', telefono);
    if (linkedin) pf.append('urls[]', linkedin);
    if (puesto)   pf.append('position', puesto);
    if (mensaje)  pf.append('cover_letter', mensaje);
    pf.append('consented_at', marcaTemporal);
    if (futuras) pf.append('future_recruitment_consented_at', marcaTemporal);
    if (fuenteId) pf.append('source_id', String(fuenteId));
    pf.append('resume', cv, cv.name);
    return pf;
  }

  async function crearCandidato(marcaTemporal) {
    const resp = await fetch(PF_BASE + '/recruitment/candidates', {
      method: 'POST',
      headers: { 'X-API-KEY': KEY },
      body: armarCuerpo(marcaTemporal)
    });
    const cuerpo = await resp.json().catch(() => ({}));
    return { r: resp, data: cuerpo };
  }

  let candidatoId = null;
  try {
    let { r, data } = await crearCandidato(fechaPF(ahora));

    // Si el validador de fechas sigue rechazando, reintenta con sólo la fecha
    if (r.status === 400 && JSON.stringify(data).indexOf('consented_at') > -1) {
      console.warn('Reintento con formato de fecha alternativo');
      ({ r, data } = await crearCandidato(soloFecha(ahora)));
    }

    candidatoId = (data && data.data && data.data.id) || (data && data.id) || null;

    // 422 = PeopleForce detectó un candidato duplicado por email o CV
    // y actualizó el existente. No es un error para la persona.
    if (!r.ok && r.status !== 422) {
      console.error('PF candidates', r.status, JSON.stringify(data));
      var pista = 'PeopleForce respondió ' + r.status + '. ';
      if (r.status === 401) pista += 'La Company API key es inválida o está desactivada.';
      else if (r.status === 403) pista += 'La clave no tiene permisos, o el plan no habilita la API (requiere Professional).';
      else if (r.status === 404) pista += 'La ruta del endpoint no existe.';
      else if (r.status === 429) pista += 'Demasiadas llamadas seguidas, esperá un minuto.';
      else pista += 'Detalle: ' + JSON.stringify(data).slice(0, 300);
      return responder({ ok: false, error: 'peopleforce', status: r.status, detalle: pista }, 502, origin);
    }
  } catch (e) {
    console.error('PF candidates fetch', e);
    return responder({
      ok: false, error: 'peopleforce',
      detalle: 'No se pudo contactar a PeopleForce: ' + String(e && e.message || e).slice(0, 300)
    }, 502, origin);
  }

  // ── 2 · Vincular el candidato a la vacante ───────────────────────
  if (vacanteId && candidatoId) {
    try {
      const r2 = await fetch(
        PF_BASE + '/recruitment/vacancies/' + encodeURIComponent(vacanteId) + '/applications',
        {
          method: 'POST',
          headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidate_id: candidatoId })
        }
      );
      if (!r2.ok) {
        const d2 = await r2.text().catch(() => '');
        console.error('PF application', r2.status, d2);
      }
    } catch (e) {
      console.error('PF application fetch', e);
    }
  }

  return responder({ ok: true }, 200, origin);
}
  }

  return responder({ ok: true }, 200, origin);
}
