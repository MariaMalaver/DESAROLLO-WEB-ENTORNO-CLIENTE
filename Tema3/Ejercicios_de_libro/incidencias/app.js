class Incidencia {
  constructor(autor, equipo, prioridad, descripcion) {
    this.id = Date.now();
    this.fecha = Date.now();
    this.autor = autor;
    this.equipo = equipo;
    this.prioridad = prioridad;
    this.descripcion = descripcion;
    this.resuelta = false;
  }

  html() {
    let clases = "incidencia " + this.prioridad;
    if (this.resuelta) clases += " resuelta";
    const hora = new Date(this.fecha).toLocaleTimeString("es-ES");

    let html = "<article class='" + clases + "'>";
    html += "<h3>" + this.equipo + " · prioridad " + this.prioridad + "</h3>";
    html += "<p>" + this.descripcion + "</p>";
    html += "<p class='meta'>" + this.autor + " · " + hora + "</p>";
    html += "<p class='meta'>hace " + this.minutos() + " min</p>";

    if (!this.resuelta) {
      html += "<button type='button' onclick='resolver(" + this.id + ")'>Resolver</button>";
    }
    html += "</article>";
    return html;
  }

  minutos() {
    return Math.floor((Date.now() - this.fecha) / 60000);
  }
}

let incidencias = [];

function guardar() {
  localStorage.setItem("incidencias", JSON.stringify(incidencias));
}

function cargar() {
  const texto = localStorage.getItem("incidencias");
  if (texto === null) return;
  const datos = JSON.parse(texto);
  for (let i = 0; i < datos.length; i++) {
    const inc = new Incidencia(datos[i].autor, datos[i].equipo, datos[i].prioridad, datos[i].descripcion);
    inc.id = datos[i].id;
    inc.fecha = datos[i].fecha;
    inc.resuelta = datos[i].resuelta;
    incidencias.push(inc);
  }
}

function pintar() {
  let html = "";
  for (let i = 0; i < incidencias.length; i++) {
    html += incidencias[i].html();
  }
  if (html === "") html = "<p>No hay incidencias.</p>";
  document.getElementById("lista").innerHTML = html;

  let pendientes = 0;
  for (let i = 0; i < incidencias.length; i++) {
    if (!incidencias[i].resuelta) pendientes++;
  }
  document.getElementById("resumen").textContent =
    "Total: " + incidencias.length + " · Pendientes: " + pendientes;
}

function avisar(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 2000);
}

document.getElementById("enviar").addEventListener("click", () => {
  const autor = document.getElementById("autor").value.trim();
  const equipo = document.getElementById("equipo").value.trim();
  const prioridad = document.getElementById("prioridad").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  if (autor === "" || equipo === "" || descripcion === "") {
    avisar("Rellena todos los campos.");
    return;
  }

  document.cookie = "autor=" + encodeURIComponent(autor) + "; max-age=" + (30 * 24 * 3600);

  incidencias.push(new Incidencia(autor, equipo, prioridad, descripcion));
  guardar();
  pintar();
  avisar("Incidencia guardada ✓");
  document.getElementById("equipo").value = "";
  document.getElementById("descripcion").value = "";
});

function resolver(id) {
  for (let i = 0; i < incidencias.length; i++) {
    if (incidencias[i].id === id) {
      incidencias[i].resuelta = true;
    }
  }
  guardar();
  pintar();
}


function leerCookie(nombre) {
  const pares = document.cookie.split("; ");
  for (let i = 0; i < pares.length; i++) {
    const partes = pares[i].split("=");
    if (partes[0] === nombre) return decodeURIComponent(partes[1]);
  }
  return null;
}

const autorGuardado = leerCookie("autor");
if (autorGuardado !== null) {
  document.getElementById("autor").value = autorGuardado;
  document.getElementById("saludo").textContent = "Hola de nuevo, " + autorGuardado;
}

setInterval(() => {
  document.getElementById("reloj").textContent = new Date().toLocaleTimeString("es-ES");
}, 1000);

cargar();
pintar();
