/**
 * ════════════════════════════════════════════════════════════════════
 *  Grupo Arvor · Puente de postulaciones hacia PeopleForce
 *  Ubicación en el repo: api/postular.js
 *
 *  Recibe la postulación desde grupoarvor.com.ar y la envía a PeopleForce
 *  con la Company API key, que vive como variable de entorno en Vercel
 *  y NUNCA viaja al navegador.
 *
 *  Variables de entorno en Vercel:
 *    PEOPLEFORCE_COMPANY_KEY = <la Company API key>          (obligatoria)
 *    PEOPLEFORCE_SOURCE_ID   = <id de la fuente "WebSite">   (opcional)
 *
 *  Si no cargás PEOPLEFORCE_SOURCE_ID, la función busca sola la fuente
 *  llamada "WebSite" y la reutiliza en las siguientes postulaciones.
 * ════════════════════════════════════════════════════════════════════ */

export const config = { runtime: 'edge' };

const PF_BASE = 'https://app.peopleforce.io/api/public/v3';

const ORIGENES = [
  'https://www.grupoarvor.com.ar',
  'https://grupoarvor.com.ar',
  'https://grupoarvor.vercel.app'
];

const NOMBRES_FUENTE = ['website', 'web site', 'sitio web', 'pagina web', 'página web'];

let fuenteCache = null;

function dosDigitos(n) {
  return n < 10 ? '0' + n : String(n);
}

function fechaLarga(d) {
  return d.getUTCFullYear() + '-' + dosDigitos(d.getUTCMonth() + 1) + '-' + dosDigitos(d.getUTCDate()) +
         'T' + dosDigitos(d.getUTCHours()) + ':' + dosDigitos(d.getUTCMinutes()) + ':' + dosDigitos(d.getUTCSeconds()) + 'Z';
}

function fechaEspacio(d) {
  return d.getUTCFullYear() + '-' + dosDigitos(d.getUTCMonth() + 1) + '-' + dosDigitos(d.getUTCDate()) +
         ' ' + dosDigitos(d.getUTCHours()) + ':' + dosDigitos(d.getUTCMinutes()) + ':' + dosDigitos(d.getUTCSeconds());
}

function fechaCorta(d) {
  return d.getUTCFullYear() + '-' + dosDigitos(d.getUTCMonth() + 1) + '-' + dosDigitos(d.getUTCDate());
}

function cabeceras(origin) {
  const permitido = ORIGENES.indexOf(origin) > -1 ? origin : ORIGENES[0];
  return {
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

function responder(body, status, origin) {
  return new Response(JSON.stringify(body), { status: status, headers: cabeceras(origin) });
}

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
    let encontrada = null;
    for (let i = 0; i < lista.length; i++) {
      const nombre = String(lista[i].name || '').trim().toLowerCase();
      if (NOMBRES_FUENTE.indexOf(nombre) > -1) { encontrada = lista[i].id; break; }
    }
    fuenteCache = encontrada;
    if (encontrada === null) {
      console.warn('No se encontro la fuente WebSite. Disponibles:', lista.map(f => f.name).join(' | '));
    }
    return fuenteCache;
  } catch (e) {
    console.error('PF sources', e);
    return null;
  }
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
      ok: false,
      error: 'config',
      detalle: 'Falta la variable PEOPLEFORCE_COMPANY_KEY en Vercel, o no se redesplego despues de cargarla.'
    }, 500, origin);
  }

  let entrada;
  try {
    entrada = await req.formData();
  } catch (e) {
    return responder({ ok: false, error: 'formato_invalido' }, 400, origin);
  }

  const nombre = String(entrada.get('nombre') || '').trim();
  const email = String(entrada.get('email') || '').trim();
  const telefono = String(entrada.get('telefono') || '').trim();
  const linkedin = String(entrada.get('linkedin') || '').trim();
  const mensaje = String(entrada.get('mensaje') || '').trim();
  const puesto = String(entrada.get('puesto') || '').trim();
  const vacanteId = String(entrada.get('vacante_id') || '').trim();
  const futuras = String(entrada.get('futuras') || '') === 'si';
  const trampa = String(entrada.get('website') || '').trim();
  const cv = entrada.get('cv');

  if (trampa) return responder({ ok: true }, 200, origin);
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
  const ext = String(cv.name).toLowerCase().split('.').pop();
  if (ext !== 'pdf' && ext !== 'doc' && ext !== 'docx') {
    return responder({ ok: false, error: 'cv_formato' }, 422, origin);
  }

  const ahora = new Date();
  const fuenteId = await obtenerFuenteId(KEY);

  // ── 1 · Crear el candidato con su CV ─────────────────────────────
  const cuerpo = new FormData();
  cuerpo.append('full_name', nombre);
  cuerpo.append('email', email);
  if (telefono) cuerpo.append('phone_numbers[]', telefono);
  if (linkedin) cuerpo.append('urls[]', linkedin);
  if (puesto) cuerpo.append('position', puesto);
  if (mensaje) cuerpo.append('cover_letter', mensaje);
  if (fuenteId) cuerpo.append('source_id', String(fuenteId));
  cuerpo.append('resume', cv, cv.name);

  let candidatoId = null;

  try {
    const r = await fetch(PF_BASE + '/recruitment/candidates', {
      method: 'POST',
      headers: { 'X-API-KEY': KEY },
      body: cuerpo
    });

    let data = {};
    try { data = await r.json(); } catch (e) { data = {}; }

    if (data && data.data && data.data.id) candidatoId = data.data.id;
    else if (data && data.id) candidatoId = data.id;

    // 422 = duplicado detectado por email o CV: PeopleForce actualiza el existente
    if (!r.ok && r.status !== 422) {
      console.error('PF candidates', r.status, JSON.stringify(data));
      let pista = 'PeopleForce respondio ' + r.status + '. ';
      if (r.status === 401) pista += 'La Company API key es invalida o esta desactivada.';
      else if (r.status === 403) pista += 'La clave no tiene permisos, o el plan no habilita la API.';
      else if (r.status === 404) pista += 'La ruta del endpoint no existe.';
      else if (r.status === 429) pista += 'Demasiadas llamadas seguidas, espera un minuto.';
      else pista += 'Detalle: ' + JSON.stringify(data).slice(0, 300);
      return responder({ ok: false, error: 'peopleforce', status: r.status, detalle: pista }, 502, origin);
    }
  } catch (e) {
    console.error('PF candidates fetch', e);
    return responder({
      ok: false,
      error: 'peopleforce',
      detalle: 'No se pudo contactar a PeopleForce: ' + String(e && e.message ? e.message : e).slice(0, 300)
    }, 502, origin);
  }

  // ── 2 · Registrar consentimientos (en JSON, no en multipart) ─────
  //        Si falla, se loguea pero no se le corta la postulacion a la persona.
  if (candidatoId) {
    const formatos = [fechaLarga(ahora), fechaEspacio(ahora), fechaCorta(ahora)];
    for (let i = 0; i < formatos.length; i++) {
      const marca = formatos[i];
      try {
        const payload = { consented_at: marca };
        if (futuras) payload.future_recruitment_consented_at = marca;
        const rc = await fetch(PF_BASE + '/recruitment/candidates/' + encodeURIComponent(candidatoId), {
          method: 'PATCH',
          headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (rc.ok) { console.log('Consentimientos OK con formato:', marca); break; }
        const t = await rc.text().catch(function () { return ''; });
        console.warn('Consentimiento rechazado', marca, rc.status, t.slice(0, 200));
      } catch (e) {
        console.warn('Consentimiento error', String(e && e.message ? e.message : e));
      }
    }
  }

  // ── 3 · Vincular el candidato a la vacante ───────────────────────
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
        const d2 = await r2.text().catch(function () { return ''; });
        console.error('PF application', r2.status, d2);
      }
    } catch (e) {
      console.error('PF application fetch', e);
    }
  }

  return responder({ ok: true }, 200, origin);
}
