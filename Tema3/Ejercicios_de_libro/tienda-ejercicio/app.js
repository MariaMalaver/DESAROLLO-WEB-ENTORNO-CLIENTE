// =====================================================================
// EJERCICIOS · Tienda DAW con carrito
// Lo que ya funciona: el catálogo. Lo que tienes que programar: el carrito.
// Busca los comentarios TODO (ejercicios 1 a 4).
// =====================================================================

// ---------------------------------------------------------------------
// DADO: la clase Producto y el catálogo (igual que en el ejemplo de clase)
// ---------------------------------------------------------------------
class Producto {
  constructor(id, nombre, precio, stock, icono) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;      // precio SIN IVA
    this.stock = stock;        // unidades disponibles en la tienda
    this.icono = icono;
  }
  conIVA() {
    return this.precio * 1.21;
  }
  disponibles() {
    const linea = carrito.buscarLinea(this.id);
    return this.stock - (linea ? linea.cantidad : 0);
  }
  html() {
      const quedan = this.disponibles();
      return "<div class='producto'>" +
        "<span class='icono'>" + this.icono + "</span>" +
        "<h3>" + this.nombre + "</h3>" +
        "<span class='precio'>" + this.conIVA().toFixed(2) + " €</span>" +
        "<span class='stock'>" + (quedan > 0 ? "Quedan " + quedan + " unidades" : "Agotado") + "</span>" +
        "<button onclick='comprar(" + this.id + ")'" + (quedan === 0 ? " disabled" : "") + ">Añadir al carrito</button>" +
        "</div>";
    }
}

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
    html += productos[i].html();
  }
  document.getElementById("catalogo").innerHTML = html;
}

function buscarProducto(id) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) return productos[i];
  }
  return null;
}

// Muestra un aviso que se borra solo a los 3 segundos
function aviso(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 3000);
}

// ---------------------------------------------------------------------
// TODO EJERCICIO 1 · La clase LineaCarrito
// Una línea del carrito guarda UN producto y CUÁNTAS unidades se compran.
//  - constructor(producto, cantidad): la cantidad vale 1 si no se indica
//  - subtotal(): precio con IVA del producto × cantidad
//  - html(): devuelve el HTML de la línea (mira la estructura en la diapositiva
//    y las clases .linea, .icono, .nombre, .cantidad y .subtotal en estilos.css).
//    El botón ✕ debe llamar a quitar(id del producto).
// ---------------------------------------------------------------------
class LineaCarrito {
  constructor(producto, cantidad = 1) {
    this.producto = producto;
    this.cantidad = cantidad;
  }
  subtotal() {
    return this.producto.conIVA() * this.cantidad;
  }
  html() {
    return `
      <div class="linea">
        <span class="icono">${this.producto.icono}</span>
        <span class="nombre">${this.producto.nombre}</span>
        <span class="cantidad">${this.cantidad}</span>
        <span class="subtotal">${this.subtotal().toFixed(2)} €</span>
        <button onclick="quitar(${this.producto.id})">✕</button>
      </div>
    `;
  }
}

// ---------------------------------------------------------------------
// El objeto carrito
// ---------------------------------------------------------------------
const carrito = {
  lineas: [],
  descuento: 0,      // 0.10 significará un 10 % (ejercicio 4)

  // TODO EJERCICIO 2 · buscarLinea(id): la línea de ese producto, o null
  buscarLinea(id) {
    for (let i = 0; i < this.lineas.length; i++) 
    {
      if (this.lineas[i].producto.id === id) 
      {
        return this.lineas[i];
      }
    }
    return null;
  },

  // TODO EJERCICIO 2 · agregar(producto)
  // Ahora mismo crea una línea nueva cada vez (como en el ejemplo).
  // Cámbialo: si el producto ya está en el carrito, suma 1 a su cantidad.
  // No se puede pasar del stock del producto: en ese caso devuelve false.
  // Si se ha podido añadir, devuelve true.
  agregar(producto) 
  {
    const linea = this.buscarLinea(producto.id);

    if (linea) 
    {
      if (linea.cantidad >= producto.stock)
      {
        return false;
      }
      linea.cantidad++;
    } else 
    {
      if (producto.stock <= 0)
      {
        return false;
      }
      this.lineas.push(new LineaCarrito(producto, 1));
    }
    return true;
  },

  // TODO EJERCICIO 3 · quitar(id): quita del array la línea de ese producto
  quitar(id) 
  {
    this.lineas = this.lineas.filter(linea => linea.producto.id !== id);
  },

  // TODO EJERCICIO 3 · vaciar(): deja el carrito sin líneas y sin descuento
  vaciar() 
  {
    this.lineas = [];
    this.descuento = 0;
  },

  // TODO EJERCICIO 3 · unidades(): suma de las cantidades de todas las líneas
  unidades() 
  {
    let totalUnidades = 0;
    for (let i = 0; i < this.lineas.length; i++) 
    {
      totalUnidades += this.lineas[i].cantidad;
    }
    return totalUnidades;
  },

  // TODO EJERCICIO 3 · total(): suma de los subtotales de todas las líneas
  total() {
    let suma = 0;
    for (let i = 0; i < this.lineas.length; i++) 
    {
      suma += this.lineas[i].subtotal();
    }
    return suma;
  },

  // TODO EJERCICIO 4 · aplicarCodigo(codigo): si el código es "DAW10"
  // (da igual mayúsculas o espacios), pon descuento a 0.10 y devuelve true.
  // Si no, devuelve false.
  aplicarCodigo(codigo) {
    if (codigo.trim().toUpperCase() === "DAW10") {
      this.descuento = 0.10;
      return true;
    }
    return false;
  },

  // DADO: rebaja y total final, redondeados a céntimos para que las cuentas cuadren
  rebaja() {
    return Number((Number(this.total().toFixed(2)) * this.descuento).toFixed(2));
  },
  totalFinal() {
    return Number(this.total().toFixed(2)) - this.rebaja();
  }
};

// ---------------------------------------------------------------------
// TODO EJERCICIO 3 · pintarCarrito()
//  - En #carrito-lineas: el html() de cada línea, o «Tu carrito está vacío»
//  - En #carrito-resumen: las unidades y el total (mira la diapositiva)
//  - Ejercicio 4: si hay descuento, muestra también el subtotal y la rebaja
// ---------------------------------------------------------------------
function pintarCarrito() {
  const contLineas = document.getElementById("carrito-lineas");
  const contResumen = document.getElementById("carrito-resumen");

  if (carrito.lineas.length === 0) {
    contLineas.innerHTML = "<p class='vacio'>Tu carrito está vacío</p>";
    contResumen.innerHTML = "";
  } else {
    let html = "";
    for (let i = 0; i < carrito.lineas.length; i++) {
      html += carrito.lineas[i].html();
    }
    contLineas.innerHTML = html;

    let resumen = "<p><span>Unidades</span><span>" + carrito.unidades() + "</span></p>";
    if (carrito.descuento > 0) {
      resumen += "<p><span>Subtotal</span><span>" + carrito.total().toFixed(2) + " €</span></p>";
      resumen += "<p class='descuento'><span>Descuento (" + (carrito.descuento * 100) + " %)</span><span>-" + carrito.rebaja().toFixed(2) + " €</span></p>";
    }
    resumen += "<p class='total'><span>Total</span><span>" + carrito.totalFinal().toFixed(2) + " €</span></p>";
    contResumen.innerHTML = resumen;
  }
  pintarCatalogo();
  guardar();
}

// ---------------------------------------------------------------------
// TODO EJERCICIO 4 · Guardar y recuperar el carrito en localStorage
// Pista: guarda solo el id y la cantidad de cada línea (y el descuento).
// Al cargar, busca cada producto por su id y vuelve a crear la LineaCarrito.
// ---------------------------------------------------------------------
function guardar() {
  const datos = {
    descuento: carrito.descuento,
    lineas: carrito.lineas.map(l => ({ id: l.producto.id, cantidad: l.cantidad }))
  };
  localStorage.setItem("carrito", JSON.stringify(datos));
}

function cargar() {
  const texto = localStorage.getItem("carrito");
  if (!texto) return;
  const datos = JSON.parse(texto);
  carrito.descuento = datos.descuento;
  carrito.lineas = [];
  for (let i = 0; i < datos.lineas.length; i++) {
    const producto = buscarProducto(datos.lineas[i].id);
    if (producto) {
      carrito.lineas.push(new LineaCarrito(producto, datos.lineas[i].cantidad));
    }
  }
}

// ---------------------------------------------------------------------
// DADO: los eventos (ya llaman a los métodos que vas a programar)
// ---------------------------------------------------------------------
function comprar(id) {
  const producto = buscarProducto(id);
  if (!carrito.agregar(producto)) {
    aviso("No quedan más unidades de " + producto.nombre);
  }
  pintarCarrito();
}

function quitar(id) {
  carrito.quitar(id);
  pintarCarrito();
}

document.getElementById("vaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
});

document.getElementById("aplicar").addEventListener("click", () => {
  const campo = document.getElementById("codigo");
  if (carrito.descuento > 0) {
    aviso("Ya has aplicado un código de descuento");
  } else if (!carrito.aplicarCodigo(campo.value)) {
    aviso("Código no válido");
  } else {
    campo.value = "";
    pintarCarrito();
  }
});

// ---------------------------------------------------------------------
// AL ABRIR LA PÁGINA
// ---------------------------------------------------------------------
pintarCatalogo();
cargar();
pintarCarrito();
