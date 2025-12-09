// -------------------------
// ESTRUCTURA DE DATOS
// -------------------------

// Base de datos de productos
const productos = [
    {id: 1, nombre: "Mesa de centro", precio: 19990},
    {id: 2, nombre: "Mesa de comedor", precio: 29990},
    {id: 3, nombre: "Silla básica", precio: 9990},
    {id: 4, nombre: "Banqueta", precio: 14990},
];

// Recuperar carrito de localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//-------------------------
// FUNCIONES DE AYUDA
//-------------------------

// Buscar producto en base de datos por id
const obtenerProducto = (id) => productos.find(p => p.id === id);

// Guardar en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Actualizar contador del nav
function actualizarContador() {
    const contador = document.getElementById("cart-count");
    // Suma la cantidad total de items 
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        if (contador) {
        contador.textContent = totalItems;
    };
};


function agregarAlCarrito(nombreProducto) {
    carrito.push(nombreProducto);
    guardarCarrito();
    actualizarContador();
    alert(`Se agregó: ${nombreProducto}`);
};

// Eliminar producto desde la página principal
function eliminarDelCarrito(nombreProducto) {
    const index = carrito.indexOf(nombreProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
        guardarCarrito();
        actualizarContador();
        alert(`Producto eliminado: ${nombreProducto}`);
    };
};

// Vaciar carrito
document.getElementById("vaciarNav").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    actualizarContador();
    alert("Carrito vaciado");
});

// Actualizar contador al cargar la página
actualizarContador();

// Botón para ir arriba
const botonIrArriba = document.getElementById("botonIrArriba");

botonIrArriba.addEventListener("click", function () {
    window.scrollTo({top: 0, behavior: 'smooth'});

});
// -------------------------
// ASIGNAR EVENTOS A BOTONES (data-nombre)
// -------------------------

document.querySelectorAll(".btn-agregar").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        agregarAlCarrito(nombre);
    });
});

document.querySelectorAll(".btn-eliminar").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        eliminarDelCarrito(nombre);
    });
});
