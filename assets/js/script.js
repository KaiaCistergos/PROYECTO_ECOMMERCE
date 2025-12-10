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
        console.error(`Error: Producto con ID ${id} no encontrado.`);
        alert("Producto no encontrado.");
        return;
    };
    const itemEnCarrito = carrito.find(item => item.id === id);
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
        alert(`Se agregó ${cantidad} unidad(es) de ${productoBase.nombre}. Cantidad actual: ${itemEnCarrito.cantidad}`);
    } else {
        carrito.push({id, cantidad});
        alert(`Se agregó ${productoBase.nombre} al carrito.`);
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
        const producto = obtenerProducto(id);
        alert(`Producto eliminado: ${producto.nombre}`);
        guardarCarrito();
        actualizarContador();
    } else {
        console.warn(`Advertencia: Producto con ID ${id} no estaba en el carrito.`);
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

////-------------------------
// Aplicar descuento
////-------------------------
function aplicarDescuento(codigo) {
    const sub = subtotal ();
    let total = sub;
    let detalleDescuento = "Sin descuento aplicado.";
    const descuentoAplicado = 0;

    switch (codigo.toUpperCase()) {
        case "PROMO10":
            if (sub >= 30000) {
                total = sub * 0.90;
                detalleDescuento = `Descuento PROMO10 (10%) aplicado.`;
            } else {
                detalleDescuento = `PROMO10 requiere un subtotal de $30.000. Actual: ${sub}.`;
            }
            break;
        case "ENVIOGRATIS":
            if (sub >= 25000) {
                total = sub - 3990;

                total = Math.max(0, total);
                detalleDescuento = `Descuento ENVIOGRATIS (-$3.990) aplicado.`;
            } else {
                detalleDescuento = `ENVIOGRATIS requiere un subtotal de $25.000. Actual: ${sub}.`;
            }
            break;
        default:
            detalleDescuento = "Código inválido.";
            break;
    }

    return {
        subtotal: sub,
        total: total,
        detalle: detalleDescuento,
        montoDescuento: sub - total
    };
};

// -------------------------
// ASIGNAR EVENTOS A BOTONES
// -------------------------

// Lógica para botón agregar
document.querySelectorAll(".btn-agregar").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        
        const producto = productos.find(p => p.nombre === nombre);
        if (producto) {
            agregarAlCarrito(producto.id, 1);
        } else {
            alert(`Error interno: Producto '${nombre}' no encontrado en la base de datos.`)
        }
    });
});

// Lógica para botón de remover
document.querySelectorAll(".btn-eliminar").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;

        const producto = productos.find(p => p.nombre === nombre);
        if (producto) {
            removerDelCarrito(producto.id);
        } else {
            alert(`Error interno: Producto '${nombre}'no encontrado en la base de datos.`)
        }
    });
});

// Lógica para botón de vaciar carrito
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
// PRUEBA
// -------------------------

// agregarAlCarrito(1, 2);
// agregarAlCarrito(3,1);
// console.log(aplicarDescuento("PROMO10"));