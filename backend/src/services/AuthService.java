package services;

import java.sql.SQLException;

import DAO.UserDAO;
import model.User;

public class AuthService {
    private UserDAO userDAO;

    public AuthService() {
        this.userDAO = new UserDAO();
    }

    //******REGISTRO: Crear nuevo usuario (siempre CLIENTE)****//

    public boolean registrar(User user) throws SQLException {
        
        User existente = userDAO.obtenerPorMail(user.getMail());
        if (existente != null) {
            throw new IllegalArgumentException("El email ya está registrado, ve a login");
        }
        
        // FORZAR rol CLIENTE (seguridad)
        user.setRole("cliente");
        
        // 3. Guardar en BD y retornar ID generado
        return userDAO.guardar(user);
    }

    /************** LOGIN: Validar credenciales********************/

    public User login(String email, String password) throws SQLException {
        // 1. Buscar usuario por email
        User user = userDAO.obtenerPorMail(email);
        
        if (user == null) {
            return null; // Email no existe
        }
        
        // 2. Validar contraseña
        if (!user.getPassword().equals(password)) {
            return null; // Contraseña incorrecta
        }
        
        // 3. Login exitoso
        return user;
    }
}
    
    

