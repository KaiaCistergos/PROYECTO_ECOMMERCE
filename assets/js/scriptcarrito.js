// Leer productos del localStorage
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const lista = document.getElementById("listaCarrito");

        carrito.forEach(producto => {
            const item = document.createElement("li");
            item.classList.add("list-group-item");
            item.textContent = producto;
            lista.appendChild(item);
        });
