/* Contenido de la página. Para actualizar la información de la carrera
   solo se edita este archivo; app.js lo dibuja en pantalla. */

const CARRERA = {
  nombre: "Ingeniería en Computación",
  universidad: "Universidad Nacional Héroes de San José de las Mulas",
  siglas: "UNHSJM",
  direccion: "Dirección de Ciencias Básicas y Tecnología",
  lema: "2026: “¡Viva Sandino! Identidad, Ciencia, Compromiso y Paz”",
  titulo: "Ingeniero(a) en Computación",
};

/* ---------- 1. Carrusel ---------- */
const SLIDES = [
  { img: "img/slide-laboratorio.jpg", pre: "Bienvenida", titulo: "Ingeniería en Computación",
    texto: "Forma parte de la carrera que diseña el software, el hardware y las redes que mueven a Nicaragua.",
    cta: ["Conoce la carrera", "#carrera"],
    credito: "Caiguanhao, CC BY-SA 3.0, Wikimedia Commons" },
  { img: "img/slide-programacion.jpg", pre: "Programación", titulo: "De la lógica al código",
    texto: "Algoritmos, estructuras de datos, programación orientada a objetos, web y móvil.",
    cta: ["Ver plan de estudio", "#plan"],
    credito: "Martin Vorel, CC BY-SA 4.0, Wikimedia Commons" },
  { img: "img/slide-electronica.jpg", pre: "Hardware", titulo: "Entiende la máquina por dentro",
    texto: "Circuitos eléctricos, sistemas digitales y arquitectura de computadoras.",
    cta: ["Áreas de estudio", "#areas"],
    credito: "Windell Oskay, CC BY 2.0, Wikimedia Commons" },
  { img: "img/slide-servidores.jpg", pre: "Redes y sistemas", titulo: "Infraestructura que conecta",
    texto: "Sistemas operativos, redes de computadoras y sistemas distribuidos.",
    cta: ["Perfiles de salida", "#perfiles"],
    credito: "BalticServers.com, CC BY-SA 3.0, Wikimedia Commons" },
  { img: "img/slide-robotica.jpg", pre: "Tecnologías emergentes", titulo: "Inteligencia artificial y robótica",
    texto: "En el último año aplicas lo aprendido en IA, robótica y sistemas de control.",
    cta: ["Deja tu reseña", "#comentar"],
    credito: "U.S. Embassy Dhaka, dominio público, Wikimedia Commons" },
];

/* ---------- 3. Organigrama (estructura de referencia) ---------- */
const ORGANIGRAMA = {
  cargo: "Consejo Universitario", nota: "Máxima autoridad colegiada",
  hijos: [{
    cargo: "Rectoría", nota: "Dirección general de la universidad",
    hijos: [
      { cargo: "Vicerrectoría Académica", nota: "Docencia, investigación y extensión",
        hijos: [{ cargo: "Dirección de Ciencias Básicas y Tecnología", nota: "Carreras de ingeniería y ciencias", destacado: true,
          hijos: [{ cargo: "Coordinación de Ingeniería en Computación", nota: "Gestión de la carrera", destacado: true,
            hijos: [{ cargo: "Docentes", nota: "Áreas académicas" }, { cargo: "Estudiantes", nota: "I a V año" }] }] }] },
      { cargo: "Secretaría General", nota: "Registro académico y títulos" },
      { cargo: "Vicerrectoría Administrativa y Financiera", nota: "Recursos, finanzas y servicios" },
    ],
  }],
};

/* ---------- 5. Modalidades ---------- */
const MODALIDADES = [
  { id: "regular", nombre: "Presencial regular", icono: "sol",
    duracion: "5 años · 10 semestres", turno: "Diurno",
    horario: [["Lunes a viernes", "7:00 a. m. – 12:00 m."], ["Laboratorios", "Según programación del semestre"]],
    texto: "Clases de lunes a viernes. Pensada para quienes estudian a tiempo completo." },
];

/* ---------- 6. Perfiles de salida ---------- */
const PERFILES = [
  { icono: "codigo", titulo: "Desarrollador(a) de software", texto: "Diseña, programa y prueba aplicaciones de escritorio, web y móviles aplicando ingeniería de software." },
  { icono: "base", titulo: "Administrador(a) de bases de datos", texto: "Modela, implementa y protege la información de empresas e instituciones." },
  { icono: "red", titulo: "Administrador(a) de redes", texto: "Instala, configura y mantiene redes de computadoras y sistemas distribuidos." },
  { icono: "chip", titulo: "Especialista en hardware y sistemas embebidos", texto: "Trabaja con circuitos, sistemas digitales, arquitectura de computadoras y control." },
  { icono: "cerebro", titulo: "Desarrollador(a) en IA y robótica", texto: "Aplica inteligencia artificial, robótica y simulación para automatizar procesos." },
  { icono: "proyecto", titulo: "Analista y gestor(a) de proyectos", texto: "Levanta requerimientos, analiza sistemas y formula y evalúa proyectos computacionales." },
  { icono: "lupa", titulo: "Investigador(a)", texto: "Desarrolla investigación científica y tecnológica para resolver problemas del país." },
  { icono: "emprende", titulo: "Emprendedor(a) tecnológico", texto: "Crea soluciones y servicios digitales propios con responsabilidad social." },
];

/* ---------- 7. Áreas de estudio ---------- */
const AREAS = {
  mat: { nombre: "Matemáticas y ciencias básicas", color: "#2f5fd0", icono: "pi",
    texto: "La base para razonar y modelar: cálculo, álgebra, estadística, física y métodos numéricos." },
  prog: { nombre: "Programación e ingeniería de software", color: "#e5197a", icono: "codigo",
    texto: "Desde los algoritmos hasta la ingeniería de software, web y móvil." },
  sis: { nombre: "Datos, sistemas y redes", color: "#0f9bd7", icono: "base",
    texto: "Bases de datos, sistemas operativos, redes, sistemas distribuidos y simulación." },
  hw: { nombre: "Hardware, control y robótica", color: "#e58a00", icono: "chip",
    texto: "Circuitos, sistemas digitales, arquitectura, control, robótica e inteligencia artificial." },
  inv: { nombre: "Investigación, prácticas y proyectos", color: "#2b9a5f", icono: "lupa",
    texto: "Metodología de la investigación, prácticas profesionales, proyectos y culminación de estudios." },
  gen: { nombre: "Formación general y humanística", color: "#7a5bd6", icono: "libro",
    texto: "Comunicación, redacción, filosofía, historia, género y cultura de paz." },
};

/* ---------- 8. Plan de asignaturas (dado por la carrera) ---------- */
const PLAN = [
  ["I", [["Matemática Introductoria", "mat"], ["Técnicas y Estrategias de Comunicación", "gen"], ["Filosofía", "gen"], ["Geometría Analítica", "mat"], ["Historia de Nicaragua", "gen"]]],
  ["II", [["Algoritmos", "prog"], ["Composición y Redacción Técnica", "gen"], ["Género en la Vida Cotidiana", "gen"], ["Cálculo I", "mat"], ["Estadísticas Descriptivas e Inferencial", "mat"]]],
  ["III", [["Programación", "prog"], ["Estructuras Discretas", "mat"], ["Física I", "mat"], ["Cálculo II", "mat"], ["Libre I (General)", "gen"], ["Álgebra Lineal para Computación", "mat"]]],
  ["IV", [["Estructura de Datos", "prog"], ["Base de Datos I", "sis"], ["Física II", "mat"], ["Cálculo III", "mat"], ["Métodos y Técnicas de Investigación", "inv"], ["Análisis Numérico para Ingeniería", "mat"]]],
  ["V", [["Programación Orientada a Objeto", "prog"], ["Base de Datos II", "sis"], ["Circuitos Eléctricos", "hw"], ["Metodología de la Investigación", "inv"], ["Prácticas de Familiarización y Profesionales", "inv"]]],
  ["VI", [["Ingeniería de Requerimientos", "prog"], ["Gráfica Asistida por Computadoras", "sis"], ["Sistemas Digitales", "hw"], ["Simulación por Computadores", "sis"], ["Optativa I: Lenguajes Formales", "prog"], ["Prácticas de Familiarización y Profesionalización", "inv"]]],
  ["VII", [["Análisis y Diseño", "prog"], ["Sistemas Operativos", "sis"], ["Arquitectura de Computadoras I", "hw"], ["Cultura de Paz", "gen"], ["Lenguajes, Compiladores e Intérprete", "prog"], ["Prácticas de Familiarización y Profesionalización", "inv"]]],
  ["VIII", [["Ingeniería del Software I", "prog"], ["Diseño Asistido por Computadora", "sis"], ["Arquitectura de Computadoras II", "hw"], ["Análisis Algorítmico Avanzado", "prog"], ["Redes de Computadoras", "sis"], ["Formas de Culminación de Estudios", "inv"]]],
  ["IX", [["Ingeniería del Software II", "prog"], ["Programación Móvil", "prog"], ["Libre II (Profesionalizante)", "gen"], ["Sistemas Distribuidos", "sis"], ["Sistemas de Control", "hw"], ["Optativa II", "gen"], ["Formas de Culminación de Estudios", "inv"]]],
  ["X", [["Formulación y Evaluación de Proyectos Computacionales", "inv"], ["Programación Web", "prog"], ["Inteligencia Artificial", "hw"], ["Robótica", "hw"], ["Libre III (Profesionalizante)", "gen"], ["Formas de Culminación de Estudios", "inv"]]],
];
