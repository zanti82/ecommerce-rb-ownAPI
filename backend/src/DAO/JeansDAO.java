package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import conexion.conexionJDB;
import model.Jeans;

public class JeansDAO {
    
     public boolean guardar(Jeans jean) throws SQLException {
        String sql = "INSERT INTO itemsjeans (ID_Ref, estilo, color, talla, stock, imagenURL, precio)"
        +" VALUES (?,?,?,?,?,?,?)";
        
        Connection conn = null;
        PreparedStatement pstmt = null;
        
        
        try{
            conn = conexionJDB.conectar(); // conectamos
            pstmt = conn.prepareStatement(sql); //preparamos el sql

            // Asignar valores ejecutando el sql

            pstmt.setInt(1, jean.getIdRef());
            pstmt.setString(2, jean.getEstilo());
            pstmt.setString(3, jean.getColor());
            pstmt.setString(4, jean.getTalla());
            pstmt.setInt(5, jean.getStock());
            pstmt.setString(6, jean.getImagenURL());
            pstmt.setDouble(7, jean.getPrice());
         

            int filas = pstmt.executeUpdate(); //  Ejecutas el SQL
            System.out.println(" Registros insertados: " + filas);

            return filas > 0;

        } finally {
            // Cierres manuales
            try {
                if (pstmt != null) pstmt.close();
                conexionJDB.cerrar(conn);
            } catch (SQLException e) {
                System.err.println(" Error al cerrar recursos: " + e.getMessage());
            }
        }

    }

    // READ
    public ArrayList<Jeans> obtenerTodasRef() throws SQLException {
        ArrayList<Jeans> jeans = new ArrayList<>();
        String sql = "SELECT * FROM itemsjeans";

        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
       
        try {
            conn = conexionJDB.conectar(); 
            
             pstmt = conn.prepareStatement(sql);

             rs = pstmt.executeQuery(); 

            while (rs.next()) {
                Jeans jean = new Jeans();

                jean.setIdRef(rs.getInt("ID_Ref"));
                jean.setEstilo(rs.getString("estilo"));
                jean.setColor(rs.getString("color"));
                jean.setTalla(rs.getString("talla"));
                jean.setStock(rs.getInt("stock"));
                jean.setImagenURL(rs.getString("imagenURL"));
                jean.setPrice(rs.getDouble("precio"));
              
                jeans.add(jean);
            }
            return jeans;
        
         
        } finally {
            try {
                if (rs != null) rs.close();
                if (pstmt != null) pstmt.close();
                conexionJDB.cerrar(conn);
            } catch (SQLException e) {
                System.err.println(" Error al cerrar recursos: " + e.getMessage());
            }
        }

       
    }


    public Jeans obtenerPorId(int id) throws SQLException {

        String sql = "SELECT * FROM itemsjeans WHERE ID_Ref = ?";
        Jeans jean = null;
    
        try (
            Connection conn = conexionJDB.conectar();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setInt(1, id);
    
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    jean = new Jeans();
                    jean.setIdRef(rs.getInt("ID_Ref"));
                    jean.setEstilo(rs.getString("estilo"));
                    jean.setColor(rs.getString("color"));
                    jean.setTalla(rs.getString("talla"));
                    jean.setStock(rs.getInt("stock"));
                    jean.setImagenURL(rs.getString("imagenURL"));
                    jean.setPrice(rs.getDouble("precio"));
                }
            }
        }
    
        return jean; // null si no existe
    }
    

    public boolean actualizar(Jeans jean) throws SQLException {
        String sql = "UPDATE itemsjeans SET  estilo = ?, color=?, talla=?, stock=?, imagenURL=?, precio = ? WHERE ID_Ref=?";

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = conexionJDB.conectar();
            pstmt = conn.prepareStatement(sql);

            pstmt.setInt(7, jean.getIdRef());
            pstmt.setString(1, jean.getEstilo());
            pstmt.setString(2, jean.getColor());
            pstmt.setString(3, jean.getTalla());
            pstmt.setInt(4, jean.getStock());
            pstmt.setString(5, jean.getImagenURL());
            pstmt.setDouble(6, jean.getPrice());
            
           

            int filas = pstmt.executeUpdate();
            System.out.println("✏️ Registros actualizados: " + filas);
            return filas > 0;

      
        } finally {
            try {
                if (pstmt != null) pstmt.close();
                conexionJDB.cerrar(conn);
            } catch (SQLException e) {
                System.err.println(" Error al cerrar recursos: " + e.getMessage());
            }
        }
    }

    // 🔹 DELETE
    public boolean eliminar(int id) throws SQLException{
        String sql = "DELETE FROM itemsjeans WHERE ID_Ref=?";

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = conexionJDB.conectar();
            pstmt = conn.prepareStatement(sql);

            pstmt.setInt(1, id);

            int filas = pstmt.executeUpdate();
            System.out.println("Registros eliminados: " + filas);
            return filas > 0;

       
        } finally {
            try {
                if (pstmt != null) pstmt.close();
                conexionJDB.cerrar(conn);
            } catch (SQLException e) {
                System.err.println("Error al cerrar recursos: " + e.getMessage());
            }
        }
    }
    
}
