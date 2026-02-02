package test;

import java.sql.SQLException;
import java.util.ArrayList;

import DAO.CarritoDAO;
import model.Carrito;
import model.CarritoDetalle;

public class testCarritoDao {

    public static void main(String[] args) {
        
        CarritoDAO testCarrito = new CarritoDAO();

        System.out.println("==============================================");
        System.out.println("    PRUEBA DE CarritoDAO");
        System.out.println("==============================================\n");

        int idUsuarioPrueba = 4;   //id de santiago
        int idJeanPrueba1 = 1004;   //id demio
        int idJeanPrueba2 = 1020;   //id rambed slim fit negro
        
                
        try {
            // =========================================
            // TEST 1: Agregar producto al carrito
            // =========================================
            System.out.println("TEST 1: Agregar producto al carrito");
            System.out.println("---------------------------------------");
            
            Carrito item1 = new Carrito(idUsuarioPrueba, idJeanPrueba1, 1);
            testCarrito.agregarProducto(item1);
            
            System.out.println("Producto agregado");
            System.out.println();
            
            // =========================================
            // TEST 2: Agregar otro producto
            // =========================================
            System.out.println("TEST 2: Agregar otro producto");
            System.out.println("---------------------------------------");
            
            Carrito item2 = new Carrito(idUsuarioPrueba, idJeanPrueba2, 1);
            testCarrito.agregarProducto(item2);
            
            System.out.println("Producto agregado tets 2");
            System.out.println();
            
            // =========================================
            // TEST 3: Agregar mismo producto (debería incrementar cantidad)
            // =========================================
            System.out.println("TEST 3: Agregar producto duplicado (debe incrementar cantidad)");
            System.out.println("------------------------------------------------------------------");
            
            Carrito item1Duplicado = new Carrito(idUsuarioPrueba, idJeanPrueba1, 2);
            testCarrito.agregarProducto(item1Duplicado);
            
            System.out.println("Cantidad actualizada.");
            System.out.println("   (Debería ser el mismo ID que el TEST 1: ");
            System.out.println();
            
            // =========================================
            // TEST 4: Obtener carrito completo con detalles
            // =========================================
            System.out.println("TEST 4: Obtener carrito completo");
            System.out.println("---------------------------------------");
            
            ArrayList<CarritoDetalle> items = testCarrito.obtenerCarritoPorUsuario(idUsuarioPrueba);
            
            if (items.isEmpty()) {
                System.out.println("⚠️  Carrito vacío");
            } else {
                System.out.println("🛒 Productos en el carrito:");
                System.out.println();
                
                double totalCarrito = 0;
                
                for (CarritoDetalle detalle : items) {
                    System.out.println("   ID Carrito: " + detalle.getIdCarrito());
                    System.out.println("   Producto: " + detalle.getEstilo());
                    System.out.println("   Color: " + detalle.getColor());
                    System.out.println("   Talla: " + detalle.getTalla());
                    System.out.println("   Precio unitario: $" + String.format("%,.0f", detalle.getPrecio()));
                    System.out.println("   Cantidad: " + detalle.getCantidad());
                    System.out.println("   Subtotal: $" + String.format("%,.0f", detalle.getSubtotal()));
                    System.out.println("   ---");
                    
                    totalCarrito += detalle.getSubtotal();
                }
                
                System.out.println();
                System.out.println("💰 TOTAL DEL CARRITO: $" + String.format("%,.0f", totalCarrito));
            }
            System.out.println();
            
            // =========================================
            // TEST 5: Eliminar un item del carrito
            // =========================================

            System.out.println("TEST 5: Eliminar un producto del carrito");
            System.out.println("---------------------------------------");

            int idCarrito2 = 2;
            
            if (idCarrito2 > 0) {
                boolean eliminado = testCarrito.eliminarItem(idCarrito2);
                
                if (eliminado) {
                    System.out.println("Producto eliminado correctamente (ID: " + idCarrito2 + ")");
                } else {
                    System.out.println("No se pudo eliminar el producto");
                }
            }
            System.out.println();
            
            // =========================================
            // TEST 6: Ver carrito después de eliminar
            // =========================================

            System.out.println("TEST 6: Ver carrito después de eliminar");
            System.out.println("---------------------------------------");
            
            items = testCarrito.obtenerCarritoPorUsuario(idUsuarioPrueba);
            System.out.println("🛒 Productos restantes: " + items.size());
            
            for (CarritoDetalle detalle : items) {
                System.out.println("   - " + detalle.getEstilo() + " (Cantidad: " + detalle.getCantidad() + ")");
            }
            System.out.println();
            
            // =========================================
            // TEST 7: Vaciar carrito completo
            // =========================================
            System.out.println("📝 TEST 7: Vaciar carrito completo");
            System.out.println("---------------------------------------");
            
            boolean vaciado = testCarrito.vaciarCarrito(idUsuarioPrueba);
            
            if (vaciado) {
                System.out.println("✅ Carrito vaciado correctamente");
                
                // Verificar que esté vacío
                items = testCarrito.obtenerCarritoPorUsuario(idUsuarioPrueba);
                System.out.println("   Productos restantes: " + items.size());
            } else {
                System.out.println("⚠️  No había productos para eliminar (o error)");
            }
            System.out.println(); 
            
            // =========================================
            // RESUMEN FINAL
            // =========================================
            System.out.println("==============================================");
            System.out.println("    ✅ TODAS LAS PRUEBAS COMPLETADAS");
            System.out.println("==============================================");
            
        } catch (SQLException e) {
            System.err.println("\n❌ ERROR EN LA PRUEBA:");
            System.err.println("   Mensaje: " + e.getMessage());
            System.err.println("   Código SQL: " + e.getErrorCode());
            e.printStackTrace();
            
        } catch (Exception e) {
            System.err.println("\n❌ ERROR INESPERADO:");
            e.printStackTrace();
        }
    }
 }
    

