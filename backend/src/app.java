import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import DAO.UserDAO;
import DAO.CarritoDAO;
import DAO.JeansDAO;
import model.User;
import services.AuthService;
import model.Carrito;
import model.CarritoDetalle;
import model.Jeans;

import com.google.gson.Gson;

public class app {
    public static void main(String[] args) throws IOException {
// Usaremos el puerto 8081 para evitar conflictos
        HttpServer server = HttpServer.create(new
                InetSocketAddress(8081), 0);
// Endpoints para cada entidad
        
        server.createContext("/api/referencias", new ReferenciasHandler());
        server.createContext("/api/usuarios", new UsauariosHandler());
        server.createContext("/api/auth/register", new RegistroUserHandler());
        server.createContext("/api/auth/login", new LoginUserHandler());
        server.createContext("/api/carrito", new CarritoHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Servidor CRUD iniciado en el puerto 8081...");
    }

    /*****************************************************************
     * Función de ayuda para enviar respuestas HTTP y no repetir código.
     *****************************************************************/
    private static void enviarRespuesta(HttpExchange exchange, String
            respuesta, int codigoHttp) throws IOException {
// Configurar cabeceras CORS para permitir la comunicación con el frontend
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin",
                "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers",
                "Content-Type, X-Requested-With");
        exchange.getResponseHeaders().set("Content-Type",
                "application/json");
        exchange.sendResponseHeaders(codigoHttp, respuesta.getBytes().length);

        
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(respuesta.getBytes());
        }
    }

 /*****************************************************************
     * HANDLER USUARIOS
     *****************************************************************/

static class UsauariosHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        Gson gson = new Gson();
        UserDAO usuarioDao = new UserDAO(); // <--- Usa User
        String metodo = exchange.getRequestMethod();
        String respuesta = "";
        int codigoHttp = 200;
        try {
            switch (metodo) {
                case "GET":

                // UserDAO debe tener un método que devuelvala vista completa

                    List<User> usuarios = usuarioDao.obtenerTodosClientes();
                    respuesta = gson.toJson(usuarios);
                    break;
                case "POST":
                    User usuarioNew = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), User.class);
                    System.out.println("Handler recibió: " + usuarioNew.getName());// para verificacr
                    boolean exitoCrear = usuarioDao.guardar(usuarioNew);
                    System.out.println("Resultado del DAO: " + exitoCrear); // <--- Esto te dirá si el DAO devolvió true o false
                    respuesta = exitoCrear ? "{\"mensaje\":\"Usuario creado\"}" : "{\"mensaje\": \"Error al crear el usuario\"}";
                    codigoHttp = exitoCrear ? 201 : 500;
                    break;
                case "PUT":
                    User usuarioActualizar = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), User.class);
                    boolean exitoActualizar = usuarioDao.actualizar(usuarioActualizar);
                    respuesta = exitoActualizar ? "{\"mensaje\":\"Usuario actualizado\"}" : "{\"mensaje\": \"Error al actualizar\"}";
                    break;
                case "DELETE":
                    String path = exchange.getRequestURI().getPath();
                    int idParaBorrar =
                            Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
                    boolean exitoBorrar = usuarioDao.eliminar(idParaBorrar);
                    respuesta = exitoBorrar ? "{\"mensaje\":\"Usuario eliminado\"}" : "{\"mensaje\": \"Error al eliminar el usuario\"}";
                    break;
                default:
                    respuesta = "{\"mensaje\": \"Método no soportado\"}";
                    codigoHttp = 405;
                    break;
            }
        } catch (SQLException e) {
            respuesta = "{\"mensaje\": \"Error en la base de datos: "
                    + e.getMessage() + "\"}";
            codigoHttp = 500;
            e.printStackTrace();
        }
        enviarRespuesta(exchange, respuesta, codigoHttp);
    }
}


 /*****************************************************************
     * HANDLER JEASN (REFERENCIAS) 
     *****************************************************************/


static class ReferenciasHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        Gson gson = new Gson();
        JeansDAO jeansDAO = new JeansDAO(); // <--- Usa jeans
        String metodo = exchange.getRequestMethod();
        String respuesta = "";
        int codigoHttp = 200;
        try {
            switch (metodo) {
                case "GET": {

                // aca tomamos el path del get y buscamos si viene con id o no

                    String path = exchange.getRequestURI().getPath();
                    String[] partes = path.split("/");

                    if (partes.length == 4) { // /referencias/{id}
                        try {
                            int id = Integer.parseInt(partes[3]);
                
                             Jeans jean = jeansDAO.obtenerPorId(id); //el nuevo metodo
                       
                        if (jean == null) {
                            respuesta = "{\"mensaje\":\"Referencia no encontrada\"}";
                            codigoHttp = 404;
                        } else {
                            respuesta = gson.toJson(jean);
                        } 
                            
                        } catch (NumberFormatException e) { //Captura error de formato si no entratn numeros
                            respuesta = "{\"mensaje\":\"ID debe ser numérico\"}";
                            codigoHttp = 400;
                            
                        }
                        
                    } else { // /referencias todas

                            respuesta = gson.toJson(jeansDAO.obtenerTodasRef());
                            codigoHttp = 200;
                        }
                                   
                    break;
                }

                case "POST":{
                    Jeans jnNuevo = gson.fromJson(
                        new InputStreamReader(exchange.getRequestBody()), Jeans.class
                    );
                    if (jeansDAO.obtenerPorId(jnNuevo.getIdRef()) != null) {
                        respuesta = "{\"mensaje\":\"ID duplicado\"}";
                        codigoHttp = 409;
                        break;
                    }
                    
                    boolean exitoCrear = jeansDAO.guardar(jnNuevo);
                        respuesta = exitoCrear ? "{\"mensaje\":\"Artículo creado\"}" : "{\"mensaje\": \"Error al crear\"}";
                        codigoHttp = exitoCrear ? 201 : 500;
                    break;
                }

                case "PUT":{
                    String path = exchange.getRequestURI().getPath();
                    int id = Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));

                    Jeans jnActualizar = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), Jeans.class);
                    jnActualizar.setIdRef(id);

                    boolean exitoActualizar =jeansDAO.actualizar(jnActualizar);
                    
                    if (exitoActualizar) {
                        respuesta = "{\"mensaje\":\"Referencia actualizada\"}";
                        codigoHttp = 200;
                    } else {
                        respuesta = "{\"mensaje\":\"No existe la referencia\"}";
                        codigoHttp = 404;
                    }
                    break;
                }

                case "DELETE":{
                    String path = exchange.getRequestURI().getPath();
                    int idParaBorrar = Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
                    boolean exitoBorrar = jeansDAO.eliminar(idParaBorrar);

                    if (exitoBorrar) {
                            respuesta = "{\"mensaje\":\"Referencia eliminada\"}";
                            codigoHttp = 200;
                        } else {
                            respuesta = "{\"mensaje\":\"No existe la referencia\"}";
                            codigoHttp = 404;
                        }
                    break;
                }

                default:
                    respuesta = "{\"mensaje\": \"Método no soportado\"}";
                    codigoHttp = 405;
                    break;
                
            }
        } catch (SQLException e) {
            respuesta = "{\"mensaje\": \"Error en la base de datos: "
                    + e.getMessage() + "\"}";
            codigoHttp = 500;
            e.printStackTrace();
        }
        enviarRespuesta(exchange, respuesta, codigoHttp);
    }
}


 /*****************************************************************
     * HANDLER REGSITRO USUARIOS
  *****************************************************************/

static class RegistroUserHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Solo permitir el POST
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            enviarRespuesta(exchange, "{\"mensaje\":\"Método no permitido\"}", 405);
            return;
        }

        Gson gson = new Gson();
        AuthService authService = new AuthService();
        String respuesta = "";
        int codigoHttp = 200;
        try {
            
             User usuarioNew = gson.fromJson(new InputStreamReader(exchange.getRequestBody()), User.class);
             
             boolean exitoCrear = authService.registrar(usuarioNew);
                    System.out.println("Resultado del authServicesDao: " + exitoCrear); // <--- Esto te dirá si el DAO devolvió true o false
                    respuesta = exitoCrear ? "{\"mensaje\":\"Usuario creado\"}" : "{\"mensaje\": \"Error al crear el usuario\"}";
                    codigoHttp = exitoCrear ? 201 : 500;
                    

            }catch (SQLException e) {
            respuesta = "{\"mensaje\": \"Error en la base de datos: "
                    + e.getMessage() + "\"}";
            codigoHttp = 500;
            e.printStackTrace();
        }
        enviarRespuesta(exchange, respuesta, codigoHttp);
    }
}

/*****************************************************************
     * HANDLER LOGIN
  *****************************************************************/

static class LoginUserHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Solo permitir el POST
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            enviarRespuesta(exchange, "{\"mensaje\":\"Método no permitido\"}", 405);
            return;
        }

        Gson gson = new Gson();
        AuthService authService = new AuthService();
        String respuesta = "";
        int codigoHttp = 200;
        try {
            LoginRequest loginData = gson.fromJson(
                new InputStreamReader(exchange.getRequestBody()), 
                LoginRequest.class
            );
            
            
             User usuarioReg = authService.login(loginData.email, loginData.password);

             if (usuarioReg == null) {
                respuesta = "{\"mensaje\":\"Credenciales inválidas\"}";
                codigoHttp = 401;
                } else {
                    // Login exitoso - crear respuesta (SIN contraseña)
                    LoginResponse response = new LoginResponse(
                        usuarioReg.getId(),
                        usuarioReg.getName(),
                        usuarioReg.getMail(),
                        usuarioReg.getRole()
                    );
                    respuesta = gson.toJson(response);
                    codigoHttp = 200;
                }
             
            }catch (SQLException e) {
            respuesta = "{\"mensaje\": \"Error en la base de datos: "
                    + e.getMessage() + "\"}";
            codigoHttp = 500;
            e.printStackTrace();
        }
        enviarRespuesta(exchange, respuesta, codigoHttp);
    }
}

// Clases auxiliares para login
static class LoginRequest {
    String email;
    String password;
}

static class LoginResponse {
    int id;
    String nombre;
    String email;
    String rol;
    
    public LoginResponse(int id, String nombre, String email, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
    }
}

/*****************************************************************
* HANDLER CARRITO
*****************************************************************/

static class CarritoHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // CORS
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        
        Gson gson = new Gson();
        CarritoDAO carritoDAO = new CarritoDAO();
        String metodo = exchange.getRequestMethod();
        String respuesta = "";
        int codigoHttp = 200;

        try {
            switch (metodo) {
                case "GET": {
                    // GET /api/carrito/{userId}
                    String path = exchange.getRequestURI().getPath();
                    String[] partes = path.split("/");
                    
                    if (partes.length >= 4) {
                        int userId = Integer.parseInt(partes[3]);
                        ArrayList<CarritoDetalle> items = carritoDAO.obtenerCarritoPorUsuario(userId);
                        respuesta = gson.toJson(items);
                    } else {
                        respuesta = "{\"mensaje\":\"ID de usuario requerido\"}";
                        codigoHttp = 400;
                    }
                    break;
                }
                
                case "POST": {
                    // Agregar producto al carrito
                    Carrito nuevoItem = gson.fromJson(
                        new InputStreamReader(exchange.getRequestBody()), 
                        Carrito.class
                    );
                    
                    int idCarrito = carritoDAO.agregarProducto(nuevoItem);
                    respuesta = "{\"mensaje\":\"Producto agregado al carrito\", \"id\":" + idCarrito + "}";
                    codigoHttp = 201;
                    break;
                }
                
                case "DELETE": {
                    String path = exchange.getRequestURI().getPath();
                    String[] partes = path.split("/");
                    
                    // Verificar si es /api/carrito/vaciar/:userId
                    if (partes.length >= 5 && "vaciar".equals(partes[3])) {
                        // DELETE /api/carrito/vaciar/:userId
                        try {
                            int userId = Integer.parseInt(partes[4]);
                            boolean vaciado = carritoDAO.vaciarCarrito(userId);
                            
                            if (vaciado) {
                                respuesta = "{\"mensaje\":\"Carrito vaciado exitosamente\"}";
                                codigoHttp = 200;
                            } else {
                                respuesta = "{\"mensaje\":\"El carrito ya estaba vacío\"}";
                                codigoHttp = 200;
                            }
                            
                        } catch (NumberFormatException e) {
                            respuesta = "{\"mensaje\":\"ID de usuario inválido\"}";
                            codigoHttp = 400;
                        }
                        
                    } else if (partes.length >= 4) {
                        // DELETE /api/carrito/:itemId (eliminar un item)
                        try {
                            int itemId = Integer.parseInt(partes[3]);
                            boolean eliminado = carritoDAO.eliminarItem(itemId);
                            
                            if (eliminado) {
                                respuesta = "{\"mensaje\":\"Producto eliminado del carrito\"}";
                                codigoHttp = 200;
                            } else {
                                respuesta = "{\"mensaje\":\"Item no encontrado\"}";
                                codigoHttp = 404;
                            }
                            
                        } catch (NumberFormatException e) {
                            respuesta = "{\"mensaje\":\"ID inválido\"}";
                            codigoHttp = 400;
                        }
                        
                    } else {
                        respuesta = "{\"mensaje\":\"Ruta no válida\"}";
                        codigoHttp = 400;
                    }
                    break;
                }
                
                default:
                    respuesta = "{\"mensaje\":\"Método no soportado\"}";
                    codigoHttp = 405;
                    break;
            }
            
        } catch (NumberFormatException e) {
            respuesta = "{\"mensaje\":\"ID inválido\"}";
            codigoHttp = 400;
            
        } catch (SQLException e) {
            respuesta = "{\"mensaje\":\"Error en BD: " + e.getMessage() + "\"}";
            codigoHttp = 500;
            e.printStackTrace();
        }
        
        enviarRespuesta(exchange, respuesta, codigoHttp);

    }
}
    
}

    

