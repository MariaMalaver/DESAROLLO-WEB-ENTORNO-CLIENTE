// =====================================================================
// 1. LA CLASE: el molde de cada incidencia (3.5)
// =====================================================================
class Incidencia {
  constructor(autor, equipo, prioridad, descripcion) {
    this.id = Date.now();          // número único: ms desde 1970 (3.2)
    this.fecha = Date.now();       // cuándo se creó
    this.autor = autor;
    this.equipo = equipo;
    this.prioridad = prioridad;    // "alta", "media" o "baja"
    this.descripcion = descripcion;
    this.resuelta = false;
  }

  // Devuelve el HTML de la tarjeta de esta incidencia
  html() {
    let clases = "incidencia " + this.prioridad;
    if (this.resuelta) clases += " resuelta";
    const hora = new Date(this.fecha).toLocaleTimeString("es-ES");

    let html = "<article class='" + clases + "'>";
    html += "<h3>" + this.equipo + " · prioridad " + this.prioridad + "</h3>";
    html += "<p>" + this.descripcion + "</p>";
    html += "<p class='meta'>" + this.autor + " · " + hora + "</p>";
    // TODO RETO 3: añade "hace X min" con this.minutos()
    // TODO RETO 1: si NO está resuelta, añade el botón:
    //   "<button type='button' onclick='resolver(" + this.id + ")'>Resolver</button>"
    
    // AQUI
    html += "<p class='meta'>hace " + this.minutos() + " min</p>"; 

    if (!this.resuelta) 
    {
      html += "<button type='button' onclick='resolver(" + this.id + ")'>Resolver</button>";
    }
    //ASTA AQUI
    // RETO 4: el botón Eliminar sale en todas las tarjetas
    html += " <button type='button' onclick='eliminar(" + this.id + ")'>Eliminar</button>";

    html += "</article>";
    return html;
  }

  // TODO RETO 3: devuelve los minutos que han pasado desde this.fecha
  //   (resta Date.now() - this.fecha y divide entre 60000; redondea con Math.floor)
  minutos() {
    return Math.floor((Date.now() - this.fecha) / 60000); //CAMBIADO DESDE MATH
  }

  // RETO 5: urgente = prioridad alta, sin resolver y con más de 30 min
  esUrgente() {
    return this.prioridad === "alta" && !this.resuelta && this.minutos() > 30;
  }

}

// =====================================================================
// 2. LOS DATOS: un array que se guarda en localStorage (3.4)
// =====================================================================
let incidencias = [];

function guardar() {
  // localStorage solo guarda texto: JSON.stringify convierte el array en texto
  localStorage.setItem("incidencias", JSON.stringify(incidencias));
}

function cargar() {
  const texto = localStorage.getItem("incidencias");
  if (texto === null) return;              // la primera vez no hay nada
  const datos = JSON.parse(texto);         // texto -> array de objetos SIN métodos
  // Volvemos a crear cada Incidencia para recuperar el método html()
  for (let i = 0; i < datos.length; i++) {
    const inc = new Incidencia(datos[i].autor, datos[i].equipo,
                               datos[i].prioridad, datos[i].descripcion);
    inc.id = datos[i].id;
    inc.fecha = datos[i].fecha;
    inc.resuelta = datos[i].resuelta;
    incidencias.push(inc);
  }
}

// =====================================================================
// 3. PINTAR la lista en la página
// =====================================================================
function pintar() {
  let html = "";
  for (let i = 0; i < incidencias.length; i++) {
    html += incidencias[i].html();
  }
  if (html === "") html = "<p>No hay incidencias.</p>";
  document.getElementById("lista").innerHTML = html;

  // TODO RETO 2: cuenta las que NO están resueltas y muéstralo así:
  //   "Total: 4 · Pendientes: 3"
  let pendientes = 0;
  for (let i = 0; i < incidencias.length; i++) {
    if (!incidencias[i].resuelta) pendientes++;
  }
  document.getElementById("resumen").textContent = "Total: " + incidencias.length + " · Pendientes: " + pendientes;
}

// RETO 5: contar las urgentes y mostrarlas en el título de la pestaña
  let urgentes = 0;
  for (let i = 0; i < incidencias.length; i++) 
  {
    if (incidencias[i].esUrgente()) urgentes++;
  }
  if (urgentes > 0) 
  {
    document.title = "(" + urgentes + ") Incidencias del aula";
  } else {
    document.title = "Incidencias del aula";
  }

// Muestra un mensaje que desaparece a los 2 segundos (3.2)
function avisar(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 2000);
}

// =====================================================================
// 4. EVENTOS: qué pasa al pulsar el botón (2.6)
// =====================================================================
document.getElementById("enviar").addEventListener("click", () => {
  const autor = document.getElementById("autor").value.trim();
  const equipo = document.getElementById("equipo").value.trim();
  const prioridad = document.getElementById("prioridad").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  if (autor === "" || equipo === "" || descripcion === "") {
    avisar("Rellena todos los campos.");
    return;
  }

  // Recordamos el nombre 30 días con una cookie (3.3)
  document.cookie = "autor=" + encodeURIComponent(autor) + "; max-age=" + (30 * 24 * 3600);

  incidencias.push(new Incidencia(autor, equipo, prioridad, descripcion));
  guardar();
  pintar();
  avisar("Incidencia guardada ✓");
  document.getElementById("equipo").value = "";
  document.getElementById("descripcion").value = "";
});

// TODO RETO 1: busca con un for la incidencia cuyo id coincide,
//   ponle resuelta = true, y después guardar() y pintar()
function resolver(id) 
{
  for (let i = 0; i < incidencias.length; i++) 
  {
    if (incidencias[i].id === id) 
    {
      incidencias[i].resuelta = true;
    }
  }
  guardar();
  pintar();
}

// RETO 4: elimina la incidencia con ese id, pidiendo confirmación
function eliminar(id) {
  if (!confirm("¿Seguro que quieres eliminar esta incidencia?")) {
    return;                  // si cancelan, no hacemos nada
  }
  for (let i = 0; i < incidencias.length; i++) {
    if (incidencias[i].id === id) {
      incidencias.splice(i, 1);   // quita 1 elemento en la posición i
    }
  }
  guardar();   // actualizo localStorage para que al recargar siga borrada
  pintar();    // vuelvo a pintar la lista
}

// =====================================================================
// 5. AL ABRIR LA PÁGINA
// =====================================================================
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

// Reloj que se actualiza cada segundo (3.2)
setInterval(() => {
  document.getElementById("reloj").textContent = new Date().toLocaleTimeString("es-ES");
}, 1000);

cargar();
pintar();

// RETO 5: repinta cada minuto para que "hace X min" y las urgentes se actualicen solas
setInterval(pintar, 60000);

