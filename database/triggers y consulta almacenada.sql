---------**********************************-consultas Rambed Jeans-***************************************************+-------
--Triggers

CREATE TABLE LogClientes (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ID_Cliente_Insertado INT,
    NombreCliente VARCHAR(100),
    FechaInsercion DATETIME DEFAULT GETDATE(),
    UsuarioInsercion VARCHAR(128) DEFAULT SUSER_SNAME(), -- SUSER_SNAME() obtiene el nombre del usuario de la BD
    HostInsercion VARCHAR(100) DEFAULT HOST_NAME() -- HOST_NAME() obtiene el nombre del equipo desde donde se conectó
);
Go
-- Este trigger se dispara DESPUÉS de insertar datos en la tabla 'cliente'
CREATE TRIGGER trg_Cliente_AfterInsert
ON cliente
AFTER INSERT 
AS
BEGIN
    
    INSERT INTO LogClientes (
        ID_Cliente_Insertado,
        NombreCliente
    )
    SELECT
        I.ID_Cliente,
        I.Nombre      
    FROM
        INSERTED AS I; -- 'INSERTED' es una tabla virtual que contiene los datos que se acaban de insertar
END;
GO

CREATE TABLE LogPantalon (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ID_Pantalon INT NOT NULL,
    NombrePantalon VARCHAR(100),
	RefPantalon VARCHAR (50),
    PrecioPantalon FLOAT,
    FechaModificacion DATETIME DEFAULT GETDATE(),
    UsuarioModificacion VARCHAR(128) DEFAULT SUSER_SNAME(),
    HostModificacion VARCHAR(100) DEFAULT HOST_NAME()
);
Go
-- Este trigger se dispara DESPUÉS de actualizar datos en la tabla 'Pantalon'
CREATE TRIGGER trg_Servicios_AuditarPantalon
ON Pantalon
AFTER UPDATE 
AS   
BEGIN
    -- Verificamos si la columna 'Ref' realmente fue actualizada
    IF UPDATE(Ref)
    BEGIN
        
        INSERT INTO LogPantalon(
            ID_Pantalon,
            NombrePantalon,
            RefPantalon,
            PrecioPantalon
        )
        SELECT
            D.ID_Pantalon,
            D.Nombre,
            D.Ref,       
            I.Ref        
        FROM
            DELETED AS D           
        INNER JOIN
            INSERTED AS I ON D.ID_Pantalon = I.ID_Pantalon 
        WHERE
            D.Ref <> I.Ref;
    END;
END;
GO
CREATE PROCEDURE sp_ListarVentasConDetalles
AS
BEGIN
    SELECT 
        V.ID_Venta,
        V.Fecha_Venta,
        C.Nombre AS NombreCliente,
        A.Nombre_Admin AS NombreAdministrador,
        V.Total
    FROM Venta V
    INNER JOIN Cliente C ON V.ID_Cliente = C.ID_Cliente
    INNER JOIN Administrador A ON V.ID_Admin = A.ID_Admin
    ORDER BY V.Fecha_Venta;
END;
GO



CREATE PROCEDURE sp_DetalleDeVenta
    @ID_Venta INT
AS
BEGIN
    SELECT 
        V.ID_Venta,
        C.Nombre AS Cliente,
        A.Nombre_Admin AS Administrador,
        P.Nombre AS Pantalon,
        DV.Cantidad,
        P.Precio,
        DV.Subtotal,
        V.Total,
        D.Direccion_Entrega,
        D.Fecha_Despacho
    FROM Venta V
    INNER JOIN Cliente C ON V.ID_Cliente = C.ID_Cliente
    INNER JOIN Administrador A ON V.ID_Admin = A.ID_Admin
    INNER JOIN Detalle_Venta DV ON V.ID_Venta = DV.ID_Venta
    INNER JOIN Pantalon P ON DV.ID_Pantalon = P.ID_Pantalon
    LEFT JOIN Despacho D ON V.ID_Venta = D.ID_Venta
    WHERE V.ID_Venta = @ID_Venta;
END;
GO


CREATE PROCEDURE sp_VerInventarioBodega
AS
BEGIN
    SELECT 
        B.ID_Bodega,
        P.Nombre AS Pantalon,
        P.Ref,
        B.Cantidad_Disponible,
        B.Fecha_Actualizacion,
        A.Nombre_Admin AS Responsable
    FROM Bodega B
    INNER JOIN Pantalon P ON B.ID_Pantalon = P.ID_Pantalon
    INNER JOIN Administrador A ON B.ID_Admin = A.ID_Admin
    ORDER BY P.Nombre;
END;
GO



CREATE PROCEDURE sp_TotalVentasPorCliente
AS
BEGIN
    SELECT 
        C.Nombre AS Cliente,
        COUNT(V.ID_Venta) AS NumeroVentas,
        SUM(V.Total) AS TotalGastado
    FROM Cliente C
    INNER JOIN Venta V ON C.ID_Cliente = V.ID_Cliente
    GROUP BY C.Nombre
    ORDER BY TotalGastado DESC;
END;
GO



CREATE PROCEDURE sp_TotalVentasPorAdministrador
AS
BEGIN
    SELECT 
        A.Nombre_Admin AS Administrador,
        COUNT(V.ID_Venta) AS VentasRealizadas,
        SUM(V.Total) AS TotalVendido
    FROM Administrador A
    INNER JOIN Venta V ON A.ID_Admin = V.ID_Admin
    GROUP BY A.Nombre_Admin
    ORDER BY TotalVendido DESC;
END;
GO



CREATE PROCEDURE sp_VentasDespachadas
AS
BEGIN
    SELECT 
        V.ID_Venta,
        C.Nombre AS Cliente,
        D.Direccion_Entrega,
        D.Fecha_Despacho,
        V.Total
    FROM Venta V
    INNER JOIN Cliente C ON V.ID_Cliente = C.ID_Cliente
    INNER JOIN Despacho D ON V.ID_Venta = D.ID_Venta
    ORDER BY D.Fecha_Despacho;
END;
GO



CREATE PROCEDURE sp_PantalonesMasVendidos
AS
BEGIN
    SELECT 
        P.Nombre AS Pantalon,
        SUM(DV.Cantidad) AS UnidadesVendidas,
        SUM(DV.Subtotal) AS TotalGenerado
    FROM Detalle_Venta DV
    INNER JOIN Pantalon P ON DV.ID_Pantalon = P.ID_Pantalon
    GROUP BY P.Nombre
    ORDER BY UnidadesVendidas DESC;
END;
GO



CREATE PROCEDURE sp_DespachosPorFecha
    @Fecha DATE
AS
BEGIN
    SELECT 
        D.ID_Despacho,
        C.Nombre AS Cliente,
        D.Direccion_Entrega,
        D.Fecha_Despacho
    FROM Despacho D
    INNER JOIN Venta V ON D.ID_Venta = V.ID_Venta
    INNER JOIN Cliente C ON V.ID_Cliente = C.ID_Cliente
    WHERE D.Fecha_Despacho = @Fecha;
END;
GO



CREATE PROCEDURE sp_InventarioConAdmin
AS
BEGIN
    SELECT 
        P.Nombre AS Pantalon,
        B.Cantidad_Disponible,
        B.Fecha_Actualizacion,
        A.Nombre_Admin AS ActualizadoPor
    FROM Bodega B
    INNER JOIN Pantalon P ON B.ID_Pantalon = P.ID_Pantalon
    INNER JOIN Administrador A ON B.ID_Admin = A.ID_Admin
    ORDER BY B.Fecha_Actualizacion DESC;
END;
GO




