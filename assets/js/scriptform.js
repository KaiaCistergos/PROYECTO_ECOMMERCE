document.getElementById("miFormulario").addEventListener("submit", function (e) {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const numero_contacto = document.getElementById("numero_contacto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !email) {
        e.preventDefault();  // evita que se envíe
        alert("Completa todos los campos obligatorios.");
    }