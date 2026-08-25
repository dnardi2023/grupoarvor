/**
 * ════════════════════════════════════════════════════════════════════
 *  Grupo Arvor · Listado de vacantes desde PeopleForce
 *  Ubicación en el repo: api/vacantes.js
 *
 *  El navegador no puede llamar directo a PeopleForce (lo bloquea CORS),
 *  así que la llamada la hace el servidor y le devuelve el resultado
 *  a la landing, ya desde el mismo dominio.
 *
 *  Variable de entorno a cargar en Vercel:
 *    PEOPLEFORCE_CAREER_KEY = <la Career API key>
 *
 *  Uso:
 *    GET /api/vacantes           → lista de búsquedas abiertas
 *    GET /api/vacantes?id=123    → detalle de una búsqueda
 * ════════════════════════════════════════════════════════════════════ */

export const config = { runtime: 'edge' };

const PF_CAREERS = 'https://app.peopleforce.io/api/careers/v1';

// Si no cargás la variable de entorno, usa esta clave.
// Es la Career API key: pública por diseño, sólo lee vacantes.
const CLAVE_POR_DEFECTO = 'GPSJxA6CHJdbySwBMRCZHrbmXy6CLk9F7cLcEbbVS8HE9FoTXo6G';

export default async function handler(req) {
  const KEY = process.env.PEOPLEFORCE_CAREER_KEY || CLAVE_POR_DEFECTO;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  const destino = id
    ? PF_CAREERS + '/vacancies/' + encodeURIComponent(id)
    : PF_CAREERS + '/vacancies?per_page=100';

  try {
    const r = await fetch(destino, {
      headers: { 'X-API-KEY': KEY, 'Accept': 'application/json' }
    });

    const texto = await r.text();

    if (!r.ok) {
      console.error('PF careers', r.status, texto.slice(0, 400));
      return new Response(
        JSON.stringify({ error: 'peopleforce', status: r.status }),
        { status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    return new Response(texto, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Cachea 5 minutos en el borde: menos llamadas a PeopleForce y carga instantánea
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (e) {
    console.error('PF careers fetch', e);
    return new Response(
      JSON.stringify({ error: 'network' }),
      { status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
