import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------- MYSQL CONNECTION -------------
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// Crear tabla si no existe
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255),
      cantidad INT,
      imagen TEXT
    );
  `);
  console.log("✔ Base de datos lista");
}

initDB();

// ---------- RUTAS API ----------------

// Obtener productos
app.get("/api/productos", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM productos ORDER BY id DESC");
  res.json(rows);
});

// Agregar producto
app.post("/api/productos", async (req, res) => {
  const { nombre, cantidad, imagen } = req.body;

  await pool.query(
    "INSERT INTO productos (nombre, cantidad, imagen) VALUES (?, ?, ?)",
    [nombre, cantidad, imagen]
  );

  res.json({ message: "Producto agregado correctamente" });
});

// Editar producto
app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, imagen } = req.body;

  await pool.query(
    "UPDATE productos SET nombre=?, cantidad=?, imagen=? WHERE id=?",
    [nombre, cantidad, imagen, id]
  );

  res.json({ message: "Producto actualizado" });
});

// Eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM productos WHERE id=?", [id]);

  res.json({ message: "Producto eliminado" });
});

// ----------- SERVER ---------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en " + PORT));
