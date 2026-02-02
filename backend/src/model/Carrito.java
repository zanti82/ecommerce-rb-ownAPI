package model;

import java.sql.Timestamp;

public class Carrito {
    private int idCarrito;
    private int idUsuario;
    private int idJean;
    private int cantidad;
    private Timestamp fechaAgregado;

    //CONSTRUCTOR FULL

    public Carrito(int idCarrito, int idUsuario, int idJean, int cantidad, Timestamp fechaAgregado) {
        this.idCarrito = idCarrito;
        this.idUsuario = idUsuario;
        this.idJean = idJean;
        this.cantidad = cantidad;
        this.fechaAgregado = fechaAgregado;
    }

    // carrito sin id sin timeStamp
    public Carrito(int idUsuario, int idJean, int cantidad) {
     
        this.idUsuario = idUsuario;
        this.idJean = idJean;
        this.cantidad = cantidad;
    }

    // CONTRUCTOR VACIO

    public Carrito() {
    }


        // Getters
        public int getIdCarrito() { return idCarrito; }

        public int getIdUsuario() { return idUsuario; }

        public int getIdJean() { return idJean; }

        public int getCantidad() { return cantidad; }

        public Timestamp getFechaAgregado() { return fechaAgregado; }

        //Setters
        public void setIdCarrito(int idCarrito) { this.idCarrito = idCarrito; }
                
        public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }
                
        public void setIdJean(int idJean) { this.idJean = idJean; }
               
        public void setCantidad(int cantidad) { this.cantidad = cantidad; }
              
        public void setFechaAgregado(Timestamp fechaAgregado) { this.fechaAgregado = fechaAgregado; }
        
        @Override
        public String toString() {
            return "Carrito{idCarrito=" + idCarrito + ", idUsuario=" + idUsuario + 
                   ", idJean=" + idJean + ", cantidad=" + cantidad + "}";
        }
    
}


