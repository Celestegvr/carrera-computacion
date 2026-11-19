/* Lógica de la página: menú, carrusel, secciones generadas desde datos.js,
   filtros del plan de estudio, reseñas y formulario de comentarios. */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ico = n => `<svg><use href="#i-${n}"/></svg>`;
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= 2. Menú principal ================= */
  const menu = $("#menu"), menuBtn = $("#menuBtn"), cabecera = $("#cabecera");
  menuBtn.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    menuBtn.setAttribute("aria-expanded", abierto);
  });
  menu.addEventListener("click", e => {
    if (e.target.closest("a")) { menu.classList.remove("abierto"); menuBtn.setAttribute("aria-expanded", "false"); }
  });
  addEventListener("scroll", () => cabecera.classList.toggle("sombra", scrollY > 10), { passive: true });

  // Resalta en el menú la sección visible
  const enlaces = $$(".menu a").filter(a => !a.classList.contains("menu-cta"));
  const obsMenu = new IntersectionObserver(ents => ents.forEach(en => {
    if (en.isIntersecting) enlaces.forEach(a => a.classList.toggle("actual", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-40% 0px -55% 0px" });
  enlaces.forEach(a => { const s = $(a.getAttribute("href")); if (s) obsMenu.observe(s); });

  /* ================= 1. Carrusel ================= */
  const DUR = 6000;
  const carrusel = $(".carrusel"), cont = $("#slides"), puntos = $("#carPuntos");
  cont.innerHTML = SLIDES.map((s, i) => `
    <article class="slide" aria-roledescription="diapositiva" aria-label="${i + 1} de ${SLIDES.length}">
      <img src="${s.img}" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>
      <div class="slide-txt">
        <span class="slide-pre">${esc(s.pre)}</span>
        <${i ? "h2" : "h1"} class="slide-titulo">${esc(s.titulo)}</${i ? "h2" : "h1"}>
        <p>${esc(s.texto)}</p>
        <a class="btn" href="${s.cta[1]}">${esc(s.cta[0])}</a>
      </div>
      <span class="slide-credito">Foto: ${esc(s.credito)}</span>
    </article>`).join("");
  puntos.innerHTML = SLIDES.map((s, i) => `<button role="tab" aria-label="Ir a: ${esc(s.titulo)}"></button>`).join("");
  carrusel.style.setProperty("--dur", DUR + "ms");

  const slides = $$(".slide"), botones = $$("button", puntos);
  let actual = 0, timer = null, pausado = reducido;
  const ir = n => {
    actual = (n + slides.length) % slides.length;
    slides.forEach((s, i) => { s.classList.toggle("activa", i === actual); s.setAttribute("aria-hidden", i !== actual); });
    botones.forEach((b, i) => {
      b.classList.remove("activo"); b.setAttribute("aria-selected", i === actual);
      if (i === actual) { void b.offsetWidth; b.classList.add("activo"); }
    });
    programar();
  };
  const programar = () => { clearTimeout(timer); if (!pausado) timer = setTimeout(() => ir(actual + 1), DUR); };
  const pausar = p => {
    pausado = p; carrusel.classList.toggle("pausado", p);
    $("#carPausa").innerHTML = p ? '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></svg>';
    $("#carPausa").setAttribute("aria-label", p ? "Reanudar carrusel" : "Pausar carrusel");
    p ? clearTimeout(timer) : ir(actual);
  };
  $("#carPrev").addEventListener("click", () => ir(actual - 1));
  $("#carNext").addEventListener("click", () => ir(actual + 1));
  botones.forEach((b, i) => b.addEventListener("click", () => ir(i)));
  $("#carPausa").addEventListener("click", () => pausar(!pausado));
  carrusel.addEventListener("keydown", e => { if (e.key === "ArrowLeft") ir(actual - 1); if (e.key === "ArrowRight") ir(actual + 1); });
  // Deslizar con el dedo en el celular
  let x0 = null;
  carrusel.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  carrusel.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) ir(actual + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(timer); else programar(); });
  ir(0);
  pausar(pausado);

  /* ================= Cifras ================= */
  const totalAsig = PLAN.reduce((t, [, a]) => t + a.length, 0);
  $("#cifraAsig").dataset.cifra = totalAsig;
  $("#cifraMod").dataset.cifra = MODALIDADES.length;
  $("#cifraModTxt").textContent = MODALIDADES.length === 1 ? "modalidad presencial" : "modalidades";
  const contar = el => {
    const fin = Number(el.dataset.cifra), t0 = performance.now();
    const paso = t => { const p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(paso); };
    reducido ? (el.textContent = fin) : requestAnimationFrame(paso);
  };
  const obsCifras = new IntersectionObserver(ents => ents.forEach(en => {
    if (en.isIntersecting) { $$("[data-cifra]", en.target).forEach(contar); obsCifras.disconnect(); }
  }), { threshold: .5 });
  obsCifras.observe($(".cifras"));

  /* ================= 3. Organigrama ================= */
  let idNodo = 0;
  const nodo = (n, padre, nivel) => {
    const id = "org" + idNodo++;
    n._id = id; n._padre = padre;
    const clase = ["org-nodo", n.destacado ? "destacado" : "", nivel === 0 ? "raiz" : ""].join(" ");
    const hijos = n.hijos ? `<ul>${n.hijos.map(h => nodo(h, n, nivel + 1)).join("")}</ul>` : "";
    return `<li><button class="${clase}" id="${id}" type="button"><b>${esc(n.cargo)}</b><small>${esc(n.nota)}</small></button>${hijos}</li>`;
  };
  $("#organigramaArbol").innerHTML = `<ul class="org-arbol">${nodo(ORGANIGRAMA, null, 0)}</ul>`;
  const porId = {};
  (function indexar(n) { porId[n._id] = n; (n.hijos || []).forEach(indexar); })(ORGANIGRAMA);
  $("#organigramaArbol").addEventListener("click", e => {
    const b = e.target.closest(".org-nodo"); if (!b) return;
    $$(".org-nodo.ruta").forEach(x => x.classList.remove("ruta"));
    for (let n = porId[b.id]; n; n = n._padre) $("#" + n._id).classList.add("ruta");
  });

  /* ================= 5. Modalidades ================= */
  $("#modalidadesLista").innerHTML = MODALIDADES.map(m => `
    <article class="modalidad revela">
      <div class="modalidad-cab"><span class="ico">${ico(m.icono)}</span><div><h3>${esc(m.nombre)}</h3><small>${esc(m.texto)}</small></div></div>
      <div class="modalidad-cuerpo">
        <div class="datos-mod">
          <div><small>Duración</small><b>${esc(m.duracion)}</b></div>
          <div><small>Turno</small><b>${esc(m.turno)}</b></div>
        </div>
        <table class="horario"><caption class="sr">Horario</caption>
          ${m.horario.map(([d, h]) => `<tr><th scope="row">${ico("reloj")} ${esc(d)}</th><td>${esc(h)}</td></tr>`).join("")}
        </table>
        <a class="btn" style="margin-top:18px" href="#plan" data-ver-plan="${m.id}">Ver su plan de estudio</a>
      </div>
    </article>`).join("");
  $$(".horario caption").forEach(c => c.remove());

  /* ================= 6. Perfiles ================= */
  $("#perfilesLista").innerHTML = PERFILES.map(p =>
    `<article class="perfil revela"><span class="ico">${ico(p.icono)}</span><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></article>`).join("");

  /* ================= 7. Áreas ================= */
  const conteo = {};
  PLAN.forEach(([, a]) => a.forEach(([, area]) => { conteo[area] = (conteo[area] || 0) + 1; }));
  const maxArea = Math.max(...Object.values(conteo));
  $("#areasLista").innerHTML = Object.entries(AREAS).map(([k, a]) => `
    <button class="area revela" type="button" data-area="${k}" style="--c:${a.color}">
      <span class="ico">${ico(a.icono)}</span>
      <h3>${esc(a.nombre)}</h3>
      <p>${esc(a.texto)}</p>
      <div class="area-barra"><i data-ancho="${(conteo[k] / maxArea) * 100}%"></i></div>
      <div class="area-cant"><span>${conteo[k]} asignaturas</span><span>${Math.round((conteo[k] / totalAsig) * 100)} % del plan</span></div>
    </button>`).join("");
  $$(".area").forEach(b => b.addEventListener("click", () => {
    filtroArea = b.dataset.area; pintarPlan();
    $("#plan").scrollIntoView({ behavior: reducido ? "auto" : "smooth" });
  }));

  /* ================= 8. Plan de estudio ================= */
  let modalidad = MODALIDADES[0].id, filtroArea = null, texto = "";
  const quitarTildes = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  $("#pestanasModalidad").innerHTML = MODALIDADES.map(m =>
    `<button role="tab" data-mod="${m.id}">${esc(m.nombre)}</button>`).join("");
  $("#filtroAreas").innerHTML = `<button class="chip" data-area="">Todas</button>` +
    Object.entries(AREAS).map(([k, a]) => `<button class="chip" data-area="${k}" style="--c:${a.color}"><i></i>${esc(a.nombre)}</button>`).join("");

  function pintarPlan() {
    const m = MODALIDADES.find(x => x.id === modalidad);
    $$("#pestanasModalidad button").forEach(b => b.setAttribute("aria-selected", b.dataset.mod === modalidad));
    $$("#filtroAreas .chip").forEach(c => c.classList.toggle("activo", (c.dataset.area || null) === filtroArea));
    $("#planInfo").innerHTML = `<b>${esc(m.nombre)}:</b> ${esc(m.duracion)} · ${totalAsig} asignaturas · ${m.horario.map(h => esc(h.join(": "))).join(" · ")}`;
    const q = quitarTildes(texto.trim());
    let visibles = 0;
    $("#planGrid").innerHTML = PLAN.map(([sem, asigs], i) => `
      <div class="semestre revela visto">
        <div class="semestre-cab"><b>${sem} Semestre</b><small>Año ${Math.floor(i / 2) + 1} · ${esc(m.turno)}</small></div>
        <ul>${asigs.map(([nombre, area]) => {
          const coincide = (!filtroArea || filtroArea === area) && (!q || quitarTildes(nombre).includes(q));
          if (coincide) visibles++;
          const clase = coincide ? (filtroArea || q ? "resaltada" : "") : "apagada";
          return `<li class="asig ${clase}" style="--c:${AREAS[area].color}" title="${esc(AREAS[area].nombre)}">${esc(nombre)}</li>`;
        }).join("")}</ul>
      </div>`).join("") + (visibles ? "" : `<p class="plan-vacio">No hay asignaturas que coincidan con la búsqueda.</p>`);
  }
  $("#pestanasModalidad").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { modalidad = b.dataset.mod; pintarPlan(); } });
  $("#filtroAreas").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { filtroArea = b.dataset.area || null; pintarPlan(); } });
  $("#buscarAsig").addEventListener("input", e => { texto = e.target.value; pintarPlan(); });
  document.addEventListener("click", e => { const a = e.target.closest("[data-ver-plan]"); if (a) { modalidad = a.dataset.verPlan; pintarPlan(); } });
  pintarPlan();

  /* ================= 9. Reseñas ================= */
  const COLORES_ROL = { Estudiante: "#24408e", Egresado: "#2b9a5f", Aspirante: "#e58a00", Docente: "#e5197a", Otro: "#5b6478" };
  const estrellas = n => `<span class="estrellas" aria-label="${n} de 5 estrellas">${[1, 2, 3, 4, 5].map(i =>
    `<svg class="${i <= n ? "" : "vacia"}"><use href="#i-estrella"/></svg>`).join("")}</span>`;
  const fecha = iso => new Date(iso).toLocaleDateString("es-NI", { day: "numeric", month: "short", year: "numeric" });
  let todas = [], mostradas = 6;

  function pintarResenas() {
    const lista = $("#resenasLista");
    if (!todas.length) {
      $("#resumenResenas").innerHTML = "";
      lista.innerHTML = `<p class="estado">Aún no hay reseñas. Sé la primera persona en comentar.</p>`;
      return;
    }
    const prom = todas.reduce((s, r) => s + r.calificacion, 0) / todas.length;
    const dist = [5, 4, 3, 2, 1].map(n => [n, todas.filter(r => r.calificacion === n).length]);
    $("#resumenResenas").innerHTML = `
      <div class="promedio"><b>${prom.toFixed(1)}</b>${estrellas(Math.round(prom))}<br><small>${todas.length} reseña${todas.length === 1 ? "" : "s"}</small></div>
      <div class="barras">${dist.map(([n, c]) => `<div><span>${n}</span><span class="b"><i style="width:${(c / todas.length) * 100}%"></i></span><span>${c}</span></div>`).join("")}</div>`;
    lista.innerHTML = todas.slice(0, mostradas).map(r => `
      <article class="resena">
        ${estrellas(r.calificacion)}
        <p>${esc(r.comentario)}</p>
        <div class="resena-autor">
          <span class="avatar" style="--c:${COLORES_ROL[r.rol] || COLORES_ROL.Otro}">${esc(r.nombre.trim().charAt(0).toUpperCase())}</span>
          <div><b>${esc(r.nombre)}</b><small>${esc(r.rol)} · ${fecha(r.creado)}</small></div>
        </div>
      </article>`).join("") +
      (todas.length > mostradas ? `<button class="btn mas" id="verMas" style="grid-column:1/-1">Ver más reseñas</button>` : "");
    const mas = $("#verMas");
    if (mas) mas.addEventListener("click", () => { mostradas += 6; pintarResenas(); });
  }

  async function cargarResenas() {
    const lista = $("#resenasLista");
    if (!BD.configurada()) {
      lista.innerHTML = `<p class="estado">La base de datos todavía no está configurada (js/config.js).</p>`;
      return;
    }
    lista.innerHTML = '<div class="esqueleto"></div>'.repeat(3);
    try {
      todas = await BD.listar();
      pintarResenas();
    } catch (err) {
      lista.innerHTML = `<p class="estado">No se pudieron cargar las reseñas. ${esc(err.message)}</p>`;
    }
  }
  cargarResenas();

  /* ================= 10. Formulario ================= */
  const form = $("#formComentario"), msg = $("#formMsg"), btn = $("#btnEnviar");
  const area = form.comentario, contador = $("#contador");
  area.addEventListener("input", () => { contador.textContent = `${area.value.length} / 500`; });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const d = {
      nombre: form.nombre.value.trim().replace(/\s+/g, " "),
      rol: form.rol.value,
      calificacion: Number(form.calificacion.value),
      comentario: area.value.trim(),
    };
    [form.nombre, area].forEach(el => el.classList.remove("error"));
    const errores = [];
    if (d.nombre.length < 2) { errores.push("tu nombre (mínimo 2 letras)"); form.nombre.classList.add("error"); }
    if (d.comentario.length < 10) { errores.push("un comentario de al menos 10 caracteres"); area.classList.add("error"); }
    if (errores.length) { msg.className = "form-msg mal"; msg.textContent = "Escribe " + errores.join(" y ") + "."; return; }
    if (form.sitio.value) return; // campo trampa: lo llenan solo los robots
    if (!BD.configurada()) { msg.className = "form-msg mal"; msg.textContent = "La base de datos no está configurada."; return; }

    btn.disabled = true; msg.className = "form-msg"; msg.textContent = "Guardando…";
    try {
      await BD.guardar(d);
      msg.className = "form-msg ok";
      msg.textContent = "¡Gracias! Tu comentario se guardó y ya aparece en las reseñas.";
      form.reset(); contador.textContent = "0 / 500";
      mostradas = 6;
      await cargarResenas();
    } catch (err) {
      msg.className = "form-msg mal";
      msg.textContent = "No se pudo guardar el comentario. " + err.message;
    } finally {
      btn.disabled = false;
    }
  });

  /* ================= Créditos y animaciones ================= */
  $("#creditosFotos").innerHTML = SLIDES.map(s => esc(s.credito)).join("<br>");

  const obsRevela = new IntersectionObserver(ents => ents.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visto");
    $$(".area-barra i", en.target).forEach(i => { i.style.width = i.dataset.ancho; });
    obsRevela.unobserve(en.target);
  }), { threshold: .12 });
  $$(".revela, .titulo-sec, .tarjetas-mini article").forEach(el => { el.classList.add("revela"); obsRevela.observe(el); });
})();
