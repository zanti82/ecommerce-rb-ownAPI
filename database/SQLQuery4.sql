CREATE DATABASE rambedWeb

use rambedWeb

CREATE TABLE Administrador (
    ID_Admin INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Admin VARCHAR(100) NOT NULL,
    Usuario VARCHAR(50) NOT NULL,
    Contrasena VARCHAR(100) NOT NULL,
    Email VARCHAR(100)
);
insert into Administrador values ('Santiago Ramirez', 'santi','1111','santi123@gmail.com');
insert into Administrador values ('Julian Posada', 'juli','2222','juli123@gmail.com');
insert into Administrador values ('Maricela Ochoa', 'mar','3333','mar123@gmail.com');
insert into Administrador values ('Maria Romero', 'maria','4444','maria123@gmail.com');

CREATE TABLE Cliente (
    ID_Cliente INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20),
    Email VARCHAR(100)
);
INSERT INTO Cliente (Nombre, Telefono, Email) VALUES
('Carlos Muñoz', '3004567890', 'carlos@gmail.com'),
('Ana Torres', '3109876543', 'ana@gmail.com'),
('Luis Pérez', '3012345678', 'luisp@gmail.com'),
('Diana Ruiz', '3152223344', 'diana@gmail.com'),
('Felipe Gómez', '3127788990', 'felipe@gmail.com'),
('Camila López', '3169911223', 'camila@gmail.com'),
('Andrés Mora', '3174455667', 'andres@gmail.com'),
('Paula Castillo', '3198877665', 'paula@gmail.com'),
('Santiago Vargas', '3112233445', 'santiv@gmail.com'),
('Natalia Romero', '3147788996', 'natalia@gmail.com');

CREATE TABLE Pantalon (
    ID_Pantalon INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50),
    ref INT,
    Precio DECIMAL(10,2)
);


insert into Pantalon values ('Fiveforty Clasico', '4212','90000');
insert into Pantalon values ('Bermuda Fiveforty 540', '45022','65000');
insert into Pantalon values ('Fiveforty Clasico', '42122','85000');
insert into Pantalon values ('Demio', '95006','89000');
insert into Pantalon values ('Cargo Overzise', '10042','100000');
insert into Pantalon values ('Cargo overzise', '1004','95000');
insert into Pantalon values ('Cargo OverZise', '10042','85000');
insert into Pantalon values ('Rambed Urban', '85002','90000');
insert into Pantalon values ('Cargo Ribete', '4400','95000');

CREATE TABLE Venta (
    ID_Venta INT PRIMARY KEY IDENTITY(1,1),
    Fecha_Venta DATE NOT NULL,
    ID_Cliente INT NOT NULL,
    ID_Admin INT NOT NULL,
    Total DECIMAL(10,2),

    CONSTRAINT fk_cliente FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente),
    CONSTRAINT fk_admin FOREIGN KEY (ID_Admin) REFERENCES Administrador(ID_Admin)
);
INSERT INTO Venta (Fecha_Venta, ID_Cliente, ID_Admin, Total) VALUES
('2025-10-01', 1, 1, 180000),
('2025-10-02', 2, 2, 90000),
('2025-10-03', 3, 1, 195000),
('2025-10-04', 4, 3, 100000),
('2025-10-05', 5, 2, 130000),
('2025-10-06', 6, 4, 85000),
('2025-10-07', 7, 1, 90000),
('2025-10-08', 8, 3, 200000),
('2025-10-09', 9, 4, 95000),
('2025-10-10', 10, 2, 150000);


CREATE TABLE Detalle_Venta (
    ID_Detalle INT PRIMARY KEY IDENTITY(1,1),
    ID_Venta INT NOT NULL,
    ID_Pantalon INT NOT NULL,
    Cantidad INT,
    Subtotal DECIMAL(10,2),

    CONSTRAINT fk_venta FOREIGN KEY (ID_Venta) REFERENCES Venta(ID_Venta),
    CONSTRAINT fk_pantalon_detalle FOREIGN KEY (ID_Pantalon) REFERENCES Pantalon(ID_Pantalon)
);
INSERT INTO Detalle_Venta (ID_Venta, ID_Pantalon, Cantidad, Subtotal) VALUES
(1, 1, 2, 180000),
(2, 2, 1, 90000),
(3, 3, 3, 195000),
(4, 4, 1, 100000),
(5, 5, 2, 130000),
(6, 6, 1, 85000),
(7, 7, 1, 90000),
(8, 8, 2, 200000),
(9, 9, 1, 95000),
(10, 1, 2, 150000);

 
CREATE TABLE Despacho (
    ID_Despacho INT PRIMARY KEY IDENTITY(1,1),
    ID_Venta INT NOT NULL,
    Direccion_Entrega VARCHAR(150),
    Fecha_Despacho DATE,

    CONSTRAINT fk_despacho_venta FOREIGN KEY (ID_Venta) REFERENCES Venta(ID_Venta)
);
INSERT INTO Despacho (ID_Venta, Direccion_Entrega, Fecha_Despacho) VALUES
(1, 'Cra 45 #12-34, Bogotá', '2025-10-02'),
(2, 'Cl 20 #8-15, Medellín', '2025-10-03'),
(3, 'Av. Siempre Viva 123, Cali', '2025-10-04'),
(4, 'Cl 50 #10-55, Bucaramanga', '2025-10-05'),
(5, 'Cra 70 #5-33, Barranquilla', '2025-10-06'),
(6, 'Cl 15 #22-10, Pereira', '2025-10-07'),
(7, 'Av. Caracas #30-20, Bogotá', '2025-10-08'),
(8, 'Cl 100 #25-40, Cali', '2025-10-09'),
(9, 'Cra 60 #45-80, Manizales', '2025-10-10'),
(10, 'Cl 33 #7-11, Ibagué', '2025-10-11');


CREATE TABLE Bodega (
    ID_Bodega INT PRIMARY KEY IDENTITY(1,1),
    ID_Pantalon INT NOT NULL,
    Cantidad_Disponible INT,
    Fecha_Actualizacion DATE,
    ID_Admin INT NOT NULL,

    CONSTRAINT fk_bodega_pantalon FOREIGN KEY (ID_Pantalon) REFERENCES Pantalon(ID_Pantalon),
    CONSTRAINT fk_bodega_admin FOREIGN KEY (ID_Admin) REFERENCES Administrador(ID_Admin)
);
INSERT INTO Bodega (ID_Pantalon, Cantidad_Disponible, Fecha_Actualizacion, ID_Admin) VALUES
(1, 40, '2025-10-01', 1),
(2, 25, '2025-10-01', 2),
(3, 30, '2025-10-02', 1),
(4, 18, '2025-10-03', 3),
(5, 20, '2025-10-03', 2),
(6, 35, '2025-10-04', 4),
(7, 15, '2025-10-05', 1),
(8, 22, '2025-10-06', 3),
(9, 28, '2025-10-07', 2),
(1, 12, '2025-10-08', 4);

SELECT * FROM Administrador;
SELECT * FROM Cliente;
SELECT * FROM Pantalon;
SELECT * FROM Venta;
SELECT * FROM Detalle_Venta;
SELECT * FROM Despacho;
SELECT * FROM Bodega;


