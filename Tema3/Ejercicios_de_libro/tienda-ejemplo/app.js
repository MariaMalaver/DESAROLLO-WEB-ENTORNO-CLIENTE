// =====================================================================
// EJEMPLO DE CLASE · Tienda DAW
// 1) Una clase Producto  2) Un array de objetos  3) Un objeto carrito
// =====================================================================

// ---------------------------------------------------------------------
// 1. LA CLASE: el molde de cada producto
// ---------------------------------------------------------------------
class Producto {
  constructor(id, nombre, precio, stock, icono) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;      // precio SIN IVA
    this.stock = stock;        // unidades disponibles
    this.icono = icono; 
  }

  // Precio con el 21 % de IVA
  conIVA() {
    return this.precio * 1.21;
  }

  // Devuelve el HTML de su tarjeta en el catálogo
  html() {
    return "<div class='producto'>" +
      "<span class='icono'>" + this.icono + "</span>" +
      "<h3>" + this.nombre + "</h3>" +
      "<span class='precio'>" + this.conIVA().toFixed(2) + " €</span>" +
      "<span class='stock'>Quedan " + this.stock + " unidades</span>" +
      "<button onclick='comprar(" + this.id + ")'>Añadir al carrito</button>" +
      "</div>";
  }
}

// ---------------------------------------------------------------------
// 2. EL CATÁLOGO: un array de objetos creados con el mismo molde
// ---------------------------------------------------------------------
const productos = [
  new Producto(1, "Ratón inalámbrico", 19.90, 5, "🖱️"),
  new Producto(2, "Teclado mecánico", 49.90, 3, "⌨️"),
  new Producto(3, "Auriculares", 29.90, 4, "🎧"),
  new Producto(4, "Memoria USB 64 GB", 9.90, 10, "💾"),
  new Producto(5, "Webcam HD", 34.90, 2, "📷"),
  new Producto(6, "Alfombrilla XL", 12.50, 6, "🟩")
];

function pintarCatalogo() {
  let html = "";
  for (let i = 0; i < productos.length; i++) {
    html += productos[i].html();       // cada objeto sabe pintarse
  }
  document.getElementById("catalogo").innerHTML = html;
}

// Busca un producto por su id (null si no existe)
function buscarProducto(id) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) return productos[i];
  }
  return null;
}

// ---------------------------------------------------------------------
// 3. EL CARRITO: un objeto literal con un array y métodos
//    (versión sencilla: si compras dos veces lo mismo, aparece dos veces)
// ---------------------------------------------------------------------
const carrito = {
  productos: [],

  agregar(producto) {
    this.productos.push(producto);     // this = el propio carrito
  },

  total() {
    let suma = 0;
    for (let i = 0; i < this.productos.length; i++) {
      suma += this.productos[i].conIVA();
    }
    return suma;
  }
};

function pintarCarrito() {
  let html = "";
  for (let i = 0; i < carrito.productos.length; i++) {
    const p = carrito.productos[i];
    html += "<p>" + p.icono + " " + p.nombre + " · " + p.conIVA().toFixed(2) + " €</p>";
  }
  if (html === "") html = "<p class='vacio'>Tu carrito está vacío</p>";
  document.getElementById("carrito-lineas").innerHTML = html;
  document.getElementById("carrito-resumen").innerHTML =
    "<p class='total'><span>Total</span><span>" + carrito.total().toFixed(2) + " €</span></p>";
}

// Lo que pasa al pulsar «Añadir al carrito»
function comprar(id) {
  const producto = buscarProducto(id);
  carrito.agregar(producto);
  pintarCarrito();
}

// ---------------------------------------------------------------------
// Al abrir la página
// ---------------------------------------------------------------------
pintarCatalogo();
pintarCarrito();
