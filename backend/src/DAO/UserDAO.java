package DAO;

import java.sql.*;
import java.util.ArrayList;

import conexion.conexionJDB;
import model.User;

public class UserDAO {


    public boolean guardar(User user) throws SQLException {
        String sql = "INSERT INTO usuario (documento_ID, nombre, email, contrasena, telefono, direccion, rol)\n" + //
                        "VALUES (?,?,?,?,?,?,?)";
        
        Connection conn = null;
        PreparedStatement pstmt = null;
        
        
        try{
            conn = conexionJDB.conectar(); // conectamos
            pstmt = conn.prepareStatement(sql); //preparamos el sql

            // Asignar valores ejecutando el sql

            pstmt.setString(1, user.getDocumento());
            pstmt.setString(2, user.getName());
            pstmt.setString(3, user.getMail());
            pstmt.setString(4, user.getPassword());
            pstmt.setString(5, user.getPhoneNumber());
            pstmt.setString(6, user.getAddress());
            pstmt.setString(7, user.getRole());

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
    public ArrayList<User> obtenerTodosClientes() throws SQLException {

        ArrayList<User> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuario";

        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
       
        try {
            conn = conexionJDB.conectar(); 
            
            pstmt = conn.prepareStatement(sql);

            rs = pstmt.executeQuery(sql); 

            while (rs.next()) {
                User usuario = new User();

                usuario.setId(rs.getInt("id_usuario"));
                usuario.setDocumento(rs.getString("documento_ID"));
                usuario.setName(rs.getString("nombre"));
                usuario.setMail(rs.getString("email"));
                usuario.setPassword(rs.getString("contrasena"));
                usuario.setPhoneNumber(rs.getString("telefono"));
                usuario.setAddress(rs.getString("direccion"));
                usuario.setRole(rs.getString("rol"));

                usuarios.add(usuario);
            }
            return usuarios;
        
                
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

    public User obtenerPorMail(String mail) throws SQLException {

        String sql = "SELECT * FROM usuario WHERE email = ?";
        User usuario = null;
    
        try (
            Connection conn = conexionJDB.conectar();
            PreparedStatement pstmt = conn.prepareStatement(sql)
        ) {
            pstmt.setString(1, mail);
    
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    usuario = new User();
                    usuario.setId(rs.getInt("id_usuario"));
                    usuario.setDocumento(rs.getString("documento_ID"));
                    usuario.setName(rs.getString("nombre"));
                    usuario.setMail(rs.getString("email"));
                    usuario.setPassword(rs.getString("contrasena"));
                    usuario.setPhoneNumber(rs.getString("telefono"));
                    usuario.setAddress(rs.getString("direccion"));
                    usuario.setRole(rs.getString("rol"));
                }
            }
        }
    
        return usuario; // null si no existe
    }
    

    public boolean actualizar(User usuario) throws SQLException{
        String sql = "UPDATE usuario SET documento_ID=?,nombre=?, email=?, contrasena=?, telefono=?, direccion=?, rol=? WHERE id_usuario=?";

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = conexionJDB.conectar();
            pstmt = conn.prepareStatement(sql);

            pstmt.setInt(8, usuario.getId());
            pstmt.setString(1, usuario.getDocumento());
            pstmt.setString(2, usuario.getName());
            pstmt.setString(3, usuario.getMail());
            pstmt.setString(4, usuario.getPassword());
            pstmt.setString(5, usuario.getPhoneNumber());
            pstmt.setString(6, usuario.getAddress());
            pstmt.setString(7, usuario.getRole());
            
            

            int filas = pstmt.executeUpdate();
            System.out.println("*** Registros actualizados: " + filas);
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

    // **********************DELETE**********************

    public boolean eliminar(int id) throws SQLException{
        String sql = "DELETE FROM usuario WHERE id_usuario=?";

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

    

