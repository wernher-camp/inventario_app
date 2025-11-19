import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

// ---- BASE DE DATOS ----
let db;
(async () => {
  db = await open({
    filename: "./inventario.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      cantidad INTEGER,
      imagen TEXT
    );
  `);
})();

// ---- RUTAS ----

// Listar productos
app.get("/api/productos", async (req, res) => {
  const rows = await db.all("SELECT * FROM productos");
  res.json(rows);
});

// Agregar producto
app.post("/api/productos", async (req, res) => {
  const { nombre, cantidad, imagen } = req.body;

  if (!nombre || !cantidad) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  await db.run(
    "INSERT INTO productos (nombre, cantidad, imagen) VALUES (?,?,?)",
    [nombre, cantidad, imagen || ""]
  );

  res.json({ message: "Producto agregado" });
});

// Editar producto
app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, imagen } = req.body;

  await db.run(
    "UPDATE productos SET nombre=?, cantidad=?, imagen=? WHERE id=?",
    [nombre, cantidad, imagen || "", id]
  );

  res.json({ message: "Producto actualizado" });
});

// Borrar producto
app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  await db.run("DELETE FROM productos WHERE id=?", [id]);
  res.json({ message: "Producto eliminado" });
});

// ---- SERVIDOR ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto " + PORT));
