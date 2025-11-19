import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// ------------------ VALIDAR VARIABLES ------------------
console.log("🔍 Variables de entorno leídas:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// Si no existen, Railway NO las está leyendo
if (!process.env.DB_HOST) {
  console.error("❌ ERROR: Railway NO está cargando las variables de entorno.");
}

// ------------------ APP ------------------
const app = express();
app.use(cors());
app.use(express.json());

// ------------------ MYSQL ------------------
let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });

  console.log("✔ Pool MySQL creado correctamente");
} catch (err) {
  console.error("❌ Error creando el pool MySQL:", err);
}

// Crear tabla si no existe
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255),
        cantidad INT,
        imagen TEXT
      );
    `);

    console.log("✔ Base de datos lista");
  } catch (error) {
    console.error("❌ Error al inicializar BD:", error);
  }
}

initDB();

// ------------------ RUTAS API ------------------

// Obtener productos
app.get("/api/productos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
    console.error(err);
  }
});

// Agregar producto
app.post("/api/productos", async (req, res) => {
  try {
    const { nombre, cantidad, imagen } = req.body;

    await pool.query(
      "INSERT INTO productos (nombre, cantidad, imagen) VALUES (?, ?, ?)",
      [nombre, cantidad, imagen]
    );

    res.json({ message: "Producto agregado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto" });
    console.error(err);
  }
});

// Editar producto
app.put("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cantidad, imagen } = req.body;

    await pool.query(
      "UPDATE productos SET nombre=?, cantidad=?, imagen=? WHERE id=?",
      [nombre, cantidad, imagen, id]
    );

    res.json({ message: "Producto actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" });
    console.error(err);
  }
});

// Eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM productos WHERE id=?", [id]);

    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
    console.error(err);
  }
});

// ------------------ SERVER ------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor corriendo en el puerto " + PORT));
