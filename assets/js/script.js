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

//-------------------------
// Agregar al carrito (id, cantidad)
//-------------------------

function agregarAlCarrito(id, cantidad = 1) {
    const productoBase = obtenerProducto(id);

    if (!productoBase) {
        console.error('Error: Producto con ID &{id} no encontrado.');
        alert("Producto no encontrado.");
        return;
    };
    const itemEnCarrito = carrito.find(item => item.id === id);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
        alert('Se agregó ${cantidad} unidad(es) de ${productoBase.nombre}. Cantidad actual: ${itemEnCarrito.cantidad}');
    } else {
        carrito.push({id, cantidad});
        alert('Se agregó ${productoBase.nombre} al carrito.')
    };
    
    guardarCarrito();
    actualizarContador();
};

//-------------------------
// Remover del carrito (id)
//-------------------------

function removerDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito.splice(index, 1);
        alert(`Producto eliminado: ${nombreProducto}`);

        guardarCarrito();
        actualizarContador();
    } else {
        console.warn('Advertencia: Producto con ID ${id} no estaba en el carrito.')
    };
};

//-------------------------
// Subtotal
//-------------------------

function subtotal() {
    return carrito.reduce((sumatoria, item) => {
        const productoBase = obtenerProducto(item.id);

        if (productoBase) {
            return sumatoria + (productoBase.precio * item.cantidad);
        };
        return sumatoria;
    }, 0);
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
