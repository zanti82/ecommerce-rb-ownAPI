
--******************************Preguntas almacenadas base de datos Rambed Jeans*************************************--

exec sp_ListarVentasConDetalles; --todas las ventas con quién compró y quién las registró

exec sp_DetalleDeVenta 3;-- todos los pantalones vendidos en una venta, el cliente, el encargado y el despacho.

exec sp_VerInventarioBodega;--Mostrar el stock actual de pantalones en bodega

exec sp_TotalVentasPorCliente;--ventas por cliente

exec sp_TotalVentasPorAdministrador;--ventas totales por administrador

exec sp_VentasDespachadas;--ventas despachadas y su destino

exec sp_PantalonesMasVendidos;-- los pantalones mas vendidos

exec sp_DespachosPorFecha @Fecha = '2025-10-06';--Consultar despachos pendientes de una fecha específica

exec sp_InventarioConAdmin;-- inventario de ventas de cada administrador

--************************triggers*************************--

--consulta tabla auditoria sobre la tabla clientes'insert'

INSERT INTO cliente VALUES
    ('Luis Garcia','3003089657','luisg@gmail.com' );--ya insertado
	('Ana Gómez', '3101234567', 'anago@gmail.com');--<-insertar datos prueba

	select * from LogClientes;

	--consulta tabla auditoria sobre la tabla pantalones'update'

SELECT * FROM Pantalon WHERE ID_Pantalon = 1; -- Ver cómo está antes

-- Actualizamos la referencia del pantalón con ID 1
UPDATE Pantalon
SET Ref = 1002
WHERE ID_Pantalon = 1;

-- Verificamos si se registró en el log
SELECT * FROM LogPantalon;
