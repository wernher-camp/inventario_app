import express from "express";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Conexión a MySQL (Railway)
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL en Railway");
});

// Obtener inventario
app.get("/api/inventario", (req, res) => {
    db.query("SELECT * FROM inventario", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

// Agregar producto
app.post("/api/inventario", (req, res) => {
    const { nombre, cantidad, imagen } = req.body;

    db.query("INSERT INTO inventario (nombre, cantidad, imagen) VALUES (?, ?, ?)",
        [nombre, cantidad, imagen],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Producto agregado", id: result.insertId });
        }
    );
});

// Puerto para Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
