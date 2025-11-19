const API = "/api/productos";

async function cargar() {
    const res = await fetch(API);
    const data = await res.json();

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    data.forEach(p => {
        lista.innerHTML += `
            <div class="card">
                <img src="${p.imagen_url}" alt="imagen">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <p><b>$${p.precio}</b> | Stock: ${p.stock}</p>
                <button onclick="eliminar(${p.id})">Eliminar</button>
            </div>
        `;
    });
}

async function agregar() {
    const producto = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        precio: precio.value,
        imagen_url: imagen_url.value,
        stock: stock.value
    };

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });

    cargar();
}

async function eliminar(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    cargar();
}

cargar();
