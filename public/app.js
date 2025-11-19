const API = "https://inventarioapp-production-7e45.up.railway.app/api/productos";
let editando = null;

async function cargar() {
    const res = await fetch(API);
    const data = await res.json();

    let html = "";
    data.forEach(p => {
        html += `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.cantidad}</td>
            <td><a href="${p.imagen}" target="_blank">Ver Imagen</a></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="cargarEditar(${p.id}, '${p.nombre}', ${p.cantidad}, '${p.imagen}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="borrar(${p.id})">Eliminar</button>
            </td>
        </tr>`;
    });

    document.getElementById("tabla").innerHTML = html;
}

async function agregar() {
    const nombre = document.getElementById("nombre").value;
    const cantidad = document.getElementById("cantidad").value;
    const imagen = document.getElementById("imagen").value;

    const metodo = editando ? "PUT" : "POST";
    const url = editando ? `${API}/${editando}` : API;

    await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cantidad, imagen })
    });

    limpiarFormulario();
    editando = null;
    cargar();
}

function cargarEditar(id, nombre, cantidad, imagen) {
    editando = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("cantidad").value = cantidad;
    document.getElementById("imagen").value = imagen;
}

async function borrar(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    cargar();
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("imagen").value = "";
}

cargar();
