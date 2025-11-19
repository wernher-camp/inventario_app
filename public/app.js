const API = "/api/productos";
const lista = document.getElementById("lista");

async function cargar() {
  const res = await fetch(API);
  const datos = await res.json();

  lista.innerHTML = "";

  datos.forEach(p => {
    lista.innerHTML += `
      <div class="item">
        <img src="${p.imagen}" />
        <p><b>${p.nombre}</b></p>
        <p>Cantidad: ${p.cantidad}</p>

        <button onclick="editar(${p.id}, '${p.nombre}', ${p.cantidad}, '${p.imagen}')">Editar</button>
        <button onclick="eliminar(${p.id})">Eliminar</button>
      </div>
    `;
  });
}

cargar();

// ------------------ AGREGAR ------------------

async function agregar() {
  const id = document.getElementById("edit-id").value;
  const nombre = document.getElementById("nombre").value;
  const cantidad = document.getElementById("cantidad").value;
  const imagen = document.getElementById("imagen").value;

  if (!nombre || !cantidad) return alert("Completa todos los campos");

  const data = { nombre, cantidad, imagen };

  let url = API;
  let method = "POST";

  if (id) {
    url = `${API}/${id}`;
    method = "PUT";
  }

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  limpiarCampos();
  cargar();
}

// ------------------ EDITAR ------------------

function editar(id, nombre, cantidad, imagen) {
  document.getElementById("edit-id").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("cantidad").value = cantidad;
  document.getElementById("imagen").value = imagen;
}

// ------------------ ELIMINAR ------------------

async function eliminar(id) {
  if (!confirm("¿Eliminar producto?")) return;

  await fetch(`${API}/${id}`, { method: "DELETE" });

  cargar();
}

// ------------------ LIMPIAR ------------------

function limpiarCampos() {
  document.getElementById("edit-id").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("imagen").value = "";
}
