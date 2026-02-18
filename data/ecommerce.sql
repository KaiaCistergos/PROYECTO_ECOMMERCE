-- ============================================
-- CREACIÓN DE TABLAS (DDL)
-- ============================================
-- Tabla Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(15) NOT NULL
);

-- Tabla Productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio NUMERIC NOT NULL CHECK (precio >= 0),
    descuento NUMERIC NOT NULL CHECK (descuento >= 0) DEFAULT 0,
    stock INT NOT NULL CHECK (stock >= 0) DEFAULT 0
);

-- Tabla Ventas
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY, 
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora TIME NOT NULL DEFAULT CURRENT_TIME,
    id_cliente INT REFERENCES clientes(id) NOT NULL
);

-- Tabla Detalle Ventas
CREATE TABLE detalle_ventas (
    id_venta INT NOT NULL REFERENCES ventas(id),
    id_producto INT NOT NULL REFERENCES productos(id),
    cantidad INT NOT NULL CHECK (cantidad > 0) DEFAULT 1,
    precio NUMERIC NOT NULL CHECK (precio >= 0),
    descuento NUMERIC NOT NULL CHECK (descuento >= 0),
    PRIMARY KEY (id_venta, id_producto)
);

-- ============================================
-- INSERTAR DATOS (DML)
-- ============================================

-- USUARIOS
INSERT INTO clientes (nombre, email, telefono) VALUES
('Pedro Hernandez', 'pedro@mail.com', '912345678'),
('Juan Gonzalez', 'juan@mail.com', '923456789'),
('Diego Soto', 'diego@mail.com', '934567890'),
('Santiago Diaz', 'santiago@mail.com', '945678901'),
('Carlos Perez', 'carlos@mail.com', '956789012');

-- PRODUCTOS
INSERT INTO productos (nombre, precio, stock) VALUES
('Mesa de centro', 19990, 8),
('Mesa de comedor', 29990, 8),
('Silla básica', 9990, 10),
('Banqueta', 14990, 5),
('Mesa de arrimo', 9990, 5);

-- VENTAS
INSERT INTO ventas (fecha, hora, id_cliente) VALUES
('2025-11-05', '12:30', 1),
('2025-11-10', '15:45', 2),
('2025-10-15', '11:00', 1),
('2025-09-20', '10:20', 3),
('2025-11-25', '18:10', 1);

-- DETALLE VENTAS
INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio, descuento) VALUES
(1, 1, 1, 19990, 0),
(1, 4, 2, 14990, 0),
(2, 3, 1, 9990, 0),
(3, 2, 1, 29990, 0),
(5, 5, 2, 9990, 0);

-- ============================================
-- CONSULTAS SOLICITADAS
-- ============================================

-- Actualizar precio -20% (Oferta verano)
UPDATE productos
SET precio = precio * 0.8;

-- Listar productos con stock crítico (<=5)
SELECT *
FROM productos
WHERE stock <= 5;

-- Simular compra (subtotal + IVA 19% + total)
SELECT
    SUM((dv.precio - dv.descuento) * dv.cantidad) AS subtotal,
    SUM((dv.precio - dv.descuento) * dv.cantidad) * 0.19 AS iva,
    SUM((dv.precio - dv.descuento) * dv.cantidad) * 1.19 AS total
FROM detalle_ventas dv
WHERE dv.id_venta = 1;

-- Total ventas noviembre 2025
SELECT
    SUM((dv.precio - dv.descuento) * dv.cantidad) AS total_ventas_noviembre
FROM ventas v
JOIN detalle_ventas dv ON v.id = dv.id_venta
WHERE v.fecha BETWEEN '2025-11-01' AND '2025-11-30';

-- Usuario que más compras realizó en 2025
SELECT c.nombre, COUNT(v.id) AS cantidad_compras
FROM clientes c
JOIN ventas v ON c.id = v.id_cliente
WHERE v.fecha BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY c.nombre
ORDER BY cantidad_compras DESC
LIMIT 1;

-- Comportamiento de compra del usuario que más compró (usuario 1 en este caso)
SELECT 
    c.nombre,
    v.fecha,
    p.nombre AS producto,
    dv.cantidad,
    (dv.precio - dv.descuento) * dv.cantidad AS total_producto
FROM clientes c
JOIN ventas v ON c.id = v.id_cliente
JOIN detalle_ventas dv ON v.id = dv.id_venta
JOIN productos p ON dv.id_producto = p.id
WHERE c.id = 1;