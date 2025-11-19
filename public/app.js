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
                <button onclick="editarProducto(${p.id}, '${p.nombre}', '${p.descripcion}', ${p.precio}, '${p.imagen_url}', ${p.stock})">
                    Editar
                </button>
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

    limpiarFormulario();
    cargar();
}

// ----------------------
//     EDITAR PRODUCTO
// ----------------------

function editarProducto(id, nombreP, descP, precioP, imgP, stockP) {
    edit_id.value = id;

    nombre.value = nombreP;
    descripcion.value = descP;
    precio.value = precioP;
    imagen_url.value = imgP;
    stock.value = stockP;

    btnAgregar.style.display = "none";
    btnEditar.style.display = "inline-block";
}

async function guardarEdicion() {
    const id = edit_id.value;

    const producto = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        precio: precio.value,
        imagen_url: imagen_url.value,
        stock: stock.value
    };

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });

    limpiarFormulario();

    btnAgregar.style.display = "inline-block";
    btnEditar.style.display = "none";

    cargar();
}

function limpiarFormulario() {
    nombre.value = "";
    descripcion.value = "";
    precio.value = "";
    imagen_url.value = "";
    stock.value = "";
    edit_id.value = "";
}

// ----------------------

async function eliminar(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    cargar();
}

cargar();
