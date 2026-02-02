package test;

import DAO.CarritoDAO;

public class testVaciarCarrito {
   
    public static void main(String[] args) throws Exception {
        CarritoDAO dao = new CarritoDAO();
        
        // Vaciar carrito del usuario 1
        boolean resultado = dao.vaciarCarrito(1);
        
        System.out.println("Carrito vaciado: " + resultado);
    }
}
    

