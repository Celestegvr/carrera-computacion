/* Acceso a la tabla de comentarios por la API REST de Supabase (PostgREST).
   No hace falta ninguna librería: solo fetch con la clave pública. */
const BD = (() => {
  const configurada = () =>
    Boolean(SUPABASE.url && SUPABASE.anonKey) && !SUPABASE.url.includes("TU-PROYECTO") && !SUPABASE.anonKey.startsWith("TU-");

  const cabeceras = extra => ({
    apikey: SUPABASE.anonKey,
    // Las claves nuevas (sb_publishable_...) van solo en apikey; las antiguas (JWT) también en Authorization
    ...(SUPABASE.anonKey.startsWith("sb_") ? {} : { Authorization: `Bearer ${SUPABASE.anonKey}` }),
    "Content-Type": "application/json",
    ...extra,
  });
  const endpoint = consulta => `${SUPABASE.url}/rest/v1/${SUPABASE.tabla}${consulta || ""}`;

  async function revisar(resp) {
    if (resp.ok) return resp;
    let detalle = "";
    try { detalle = (await resp.json()).message || ""; } catch (e) { /* sin cuerpo */ }
    throw new Error(`Error ${resp.status}${detalle ? ": " + detalle : ""}`);
  }

  // Últimos comentarios visibles, del más reciente al más antiguo
  async function listar(limite = 200) {
    const q = `?select=id,nombre,rol,calificacion,comentario,creado&order=creado.desc&limit=${limite}`;
    const resp = await revisar(await fetch(endpoint(q), { headers: cabeceras() }));
    return resp.json();
  }

  // Inserta un comentario; la base de datos valida longitudes y rango de la calificación
  async function guardar(c) {
    const resp = await fetch(endpoint(), {
      method: "POST",
      headers: cabeceras({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        nombre: c.nombre, rol: c.rol, calificacion: c.calificacion, comentario: c.comentario,
      }),
    });
    await revisar(resp);
  }

  return { configurada, listar, guardar };
})();
