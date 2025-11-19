CREATE TABLE inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  cantidad INT NOT NULL,
  imagen VARCHAR(500) NULL
);

INSERT INTO inventario (nombre, cantidad, imagen) VALUES
('Teclado inalámbrico', 15, 'https://i.imgur.com/7b4QF1U.jpeg'),
('Mouse gamer RGB', 30, 'https://i.imgur.com/n7qP3XJ.jpeg');
