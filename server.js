import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

// Obtener productos
app.get("/api/productos", (req, res) => {
    db.query("SELECT * FROM productos", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Agregar producto
app.post("/api/productos", (req, res) => {
    const { nombre, descripcion, precio, imagen_url, stock } = req.body;
    const sql = "INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nombre, descripcion, precio, imagen_url, stock], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Producto agregado", id: result.insertId });
    });
});

// Editar producto
app.put("/api/productos/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen_url, stock } = req.body;

    const sql = `
        UPDATE productos 
        SET nombre=?, descripcion=?, precio=?, imagen_url=?, stock=?
        WHERE id=?
    `;

    db.query(sql, [nombre, descripcion, precio, imagen_url, stock, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Producto actualizado" });
    });
});

// Eliminar
app.delete("/api/productos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM productos WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Producto eliminado" });
    });
});

app.listen(process.env.PORT || 3000, () =>
    console.log("Servidor encendido")
);
