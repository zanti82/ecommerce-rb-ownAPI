package conexion;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class conexionJDB {
   
    private static final String DB_URL = "jdbc:mysql://localhost:3306/rambedWeb";
    private static final String USER = "root";
    private static final String PASS = "zantilenovo";
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";

    // Método para abrir la conexión
    public static Connection conectar() {
        Connection conn = null;
        try {
            // Cargar el driver
            Class.forName(DRIVER);
            
            // Establecer conexión
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            System.out.println("✅ Conexión establecida correctamente.");
        } catch (ClassNotFoundException e) {
            System.err.println("❌ No se encontró el driver JDBC: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("❌ Error al conectar con la base de datos: " + e.getMessage());
        }
        return conn;
    }

    public static void cerrar(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
                System.out.println("🔌 Conexión cerrada correctamente.");
            } catch (SQLException e) {
                System.err.println("⚠️ Error al cerrar la conexión: " + e.getMessage());
            }
        }
    }
}