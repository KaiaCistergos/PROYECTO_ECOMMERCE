// -------------------------
// ESTRUCTURA DE DATOS
// -------------------------

let productos = []; // ahora vienen desde JSON
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// -------------------------
// ELEMENTOS DOM
// -------------------------

const cartCountEl = document.getElementById("cart-count");
const buscar = document.getElementById("buscar");

// -------------------------
// FUNCIONES DE AYUDA
// -------------------------

const obtenerProducto = (id) => productos.find(p => p.id === id);

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContador() {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (cartCountEl) cartCountEl.textContent = total;
}

// -------------------------
// FETCH JSON LOCAL
// -------------------------

const getProductos = async () => {
    try {
        const res = await fetch("../data/productos.json");
        if (!res.ok) throw new Error("No se pudo cargar el JSON");
        productos = await res.json();
        console.log("Productos cargados:", productos);
    } catch (error) {
        console.error(error.message);
    }
};

// -------------------------
// CARRITO
// -------------------------

function agregarAlCarrito(id, cantidad = 1) {
    const producto = obtenerProducto(id);
    if (!producto) return;

    const item = carrito.find(p => p.id === id);
    item ? item.cantidad += cantidad : carrito.push({ id, cantidad });

    guardarCarrito();
    actualizarContador();
}

function removerDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarContador();
}

// -------------------------
// SUBTOTAL Y DESCUENTOS
// -------------------------

function subtotal() {
    return carrito.reduce((acc, item) => {
        const p = obtenerProducto(item.id);
        return p ? acc + p.precio * item.cantidad : acc;
    }, 0);
}

function aplicarDescuento(codigo) {
    const sub = subtotal();
    let total = sub;
    let detalle = "Sin descuento aplicado";

    if (codigo === "PROMO10" && sub >= 30000) {
        total = sub * 0.9;
        detalle = "Descuento PROMO10 (10%) aplicado";
    }

    if (codigo === "ENVIOGRATIS" && sub >= 25000) {
        total = Math.max(0, sub - 3990);
        detalle = "Envío gratis aplicado";
    }

    return { subtotal: sub, total, detalle };
}

// -------------------------
// RESUMEN
// -------------------------

function resumen(codigo) {
    const d = aplicarDescuento(codigo);

    const items = carrito.map(item => {
        const p = obtenerProducto(item.id);
        return `${p.nombre} x${item.cantidad}`;
    }).join(" | ");

    return `
Items: ${items}
Subtotal: $${d.subtotal}
${d.detalle}
Total: $${d.total}
`;
}

// -------------------------
// EVENTOS 
// -------------------------

// ------------------------
// Botón AGREGAR
// -------------------------

document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
        const nombre = btn.dataset.nombre;
        const producto = productos.find(p => p.nombre === nombre);
        if (producto) {
            agregarAlCarrito(producto.id);
            console.log(resumen("PROMO10"));
        }
    });
});

// -------------------------
// Botón ELIMINAR
// -------------------------

document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
        const nombre = btn.dataset.nombre;
        const producto = productos.find(p => p.nombre === nombre);
        if (producto) {
            removerDelCarrito(producto.id);
            console.log(resumen("PROMO10"));
        }
    });
});

// -------------------------
// Botón VACIAR
// -------------------------

const btnVaciar = document.getElementById("vaciarNav");
if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
        carrito = [];
        guardarCarrito();
        actualizarContador();
        console.log("Carrito vaciado");
    });
}

// -------------------------
// INIT
// -------------------------

actualizarContador();
getProductos();
