async function cargar() {
    const res = await fetch("/api/inventario");
    const data = await res.json();

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    data.forEach(p => {
        contenedor.innerHTML += `
            <div class="card">
                <img src="${p.imagen}" alt="">
                <h3>${p.nombre}</h3>
                <p>Cantidad: ${p.cantidad}</p>
            </div>
        `;
    });
}

async function agregar() {
    const nombre = document.getElementById("nombre").value;
    const cantidad = document.getElementById("cantidad").value;
    const imagen = document.getElementById("imagen").value;

    await fetch("/api/inventario", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nombre, cantidad, imagen})
    });

    cargar();
}

cargar();
