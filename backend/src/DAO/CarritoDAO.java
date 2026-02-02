package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import conexion.conexionJDB;
import model.Carrito;
import model.CarritoDetalle;

public class CarritoDAO {

    private Carrito getItemxUserxProduct(int idUsuario, int idJean) throws SQLException{

        String sql = "SELECT * FROM Carrito WHERE id_usuario=? AND id_item=? ";

        try( Connection conn = conexionJDB.conectar();   //con este try with resources que en parenteses java se encarga de cerrarlos
            PreparedStatement pstmt = conn.prepareStatement(sql);)
            {
                pstmt.setInt(1,idUsuario);
                pstmt.setInt(2,idJean);

                try(ResultSet rs = pstmt.executeQuery())
                {
                    if(rs.next()){
                        return new Carrito(
                        rs.getInt("id_carrito"),
                        rs.getInt("id_usuario"),
                        rs.getInt("id_item"),
                        rs.getInt("cantidad"),
                        rs.getTimestamp("fecha_agregado")
                        );
                    }
                }
            }
            return null;
        
    }

    public int agregarProducto(Carrito item) throws SQLException{

        //verifiquemos si hay el item esta en el carro, si si que sume, si no que lo suba

        Carrito exist = getItemxUserxProduct(item.getIdUsuario(), item.getIdJean());

        if(exist != null){

            int newCantidad = exist.getCantidad() + item.getCantidad();
            return updateCantidad(exist.getIdCarrito(), newCantidad);

        }

        // si no existe

        String sql = "INSERT INTO carrito (id_usuario, id_item, cantidad) VALUES (?,?,?) ";
        try (
            Connection conn = conexionJDB.conectar();
            PreparedStatement pstmt = conn.prepareStatement(sql)
            ) {
            pstmt.setInt(1, item.getIdUsuario());
            pstmt.setInt(2, item.getIdJean());
            pstmt.setInt(3, item.getCantidad());
            
            int filas = pstmt.executeUpdate();
            // Solo lanzamos error si las filas afectadas son 0
                if (filas == 0) {
                    throw new SQLException("Error: No se insertó el registro.");
                }

            return  filas;

            } catch (SQLException e) {
                // Es vital capturar el error o declarar que el método lo lanza
                System.err.println("Error en la base de datos: " + e.getMessage());
                throw e; 
            }
        }

    private int updateCantidad(int idCarrito, int nuevaCantidad) throws SQLException {
            String sql = "UPDATE Carrito SET cantidad = ? WHERE id_carrito = ?";
            
            try (
                Connection conn = conexionJDB.conectar();
                PreparedStatement pstmt = conn.prepareStatement(sql)
            ) {
                pstmt.setInt(1, nuevaCantidad);
                pstmt.setInt(2, idCarrito);
                
                pstmt.executeUpdate();
                return idCarrito;
            }
        }
     
    public ArrayList<CarritoDetalle> obtenerCarritoPorUsuario(int idUsuario) throws SQLException {
        ArrayList<CarritoDetalle> items = new ArrayList<>();
        
        String sql = "SELECT c.id_carrito, c.id_item, c.cantidad, " +
                     "j.estilo, j.color, j.talla, j.precio,(c.cantidad * j.precio) as subtotal, j.imagenURL " +
                     "FROM carrito c " +
                     "JOIN itemsjeans j ON c.id_item = j.ID_Ref " +
                     "WHERE c.id_usuario = ?";
        
        try (
            Connection conn = conexionJDB.conectar();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setInt(1, idUsuario);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    CarritoDetalle detalle = new CarritoDetalle(
                        rs.getInt("id_carrito"),
                        rs.getInt("id_item"),
                        rs.getString("estilo"),
                        rs.getString("color"),
                        rs.getString("talla"),
                        rs.getDouble("precio"),
                        rs.getInt("cantidad"),
                        rs.getDouble("subtotal"),
                        rs.getString("imagenURL")
                    );
                    items.add(detalle);
                }
            }
        }
        
            return items;
        }

    public boolean eliminarItem(int idCarrito) throws SQLException {
        String sql = "DELETE FROM Carrito WHERE id_carrito = ?";
        
        try (
            Connection conn = conexionJDB.conectar();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setInt(1, idCarrito);
            return pstmt.executeUpdate() > 0;
        }
    }

    public boolean vaciarCarrito(int idUsuario) throws SQLException {
        String sql = "DELETE FROM Carrito WHERE id_usuario = ?";
        
        try (
            Connection conn = conexionJDB.conectar();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setInt(1, idUsuario);
            return pstmt.executeUpdate() > 0;
        }
    }
    
}
