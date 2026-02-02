package model;

public class CarritoDetalle {

    private int idCarrito;
    private int idRef;
    private String estilo;
    private String color;
    private String talla;
    private double precio;
    private int cantidad;
    private double subtotal;
    private String imagenURL;

    //constructor full

    public CarritoDetalle(int idCarrito, int idRef, String estilo, String color, String talla, double precio,
            int cantidad, double subtotal, String imagenURL) {
        this.idCarrito = idCarrito;
        this.idRef = idRef;
        this.estilo = estilo;
        this.color = color;
        this.talla = talla;
        this.precio = precio;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
        this.imagenURL = imagenURL;
    }



     // construc sin idCarritotor

    public CarritoDetalle(int idRef, String estilo, String color, String talla, double precio, int cantidad,
            double subtotal, String imagenURL) {
        this.idRef = idRef;
        this.estilo = estilo;
        this.color = color;
        this.talla = talla;
        this.precio = precio;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
        this.imagenURL = imagenURL;
    }


    // construc vacio

    public CarritoDetalle() {}

    //getters

    public int getIdCarrito() {  return idCarrito; }

    public int getIdRef() {  return idRef; }

    public String getEstilo() {  return estilo;  }

    public String getColor() {  return color; }

    public String getTalla() {  return talla;  }

    public double getPrecio() { return precio;  }

    public int getCantidad() { return cantidad;  }

    public double getSubtotal() { return subtotal;  }

    public String getImagenURL() { return imagenURL;  }


    //setters

    public void setIdCarrito(int idCarrito) { this.idCarrito = idCarrito; }

    public void setIdRef(int idRef) { this.idRef = idRef; }

    public void setEstilo(String estilo) { this.estilo = estilo; }

    public void setColor(String color) { this.color = color; }

    public void setTalla(String talla) { this.talla = talla; }

    public void setPrecio(double precio) { this.precio = precio; }

    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public void setSubtotal(double subtotal) {
      
        this.subtotal = precio * cantidad;
    }

    public void setImagenURL(String imagenURL) {
        this.imagenURL = imagenURL;
    }

    


    

    

    

    

    


    
}
