package model;
public class Jeans {

    private int idRef;
    private String estilo;
    private String color;
    private String talla;
    private int stock;
    private String imagenURL;
    private double price;
    
 //contructo vacio
    public Jeans() {
    }


 //constructor
    public Jeans(int idRef, String estilo, String color, String talla, int stock, String imagenURL, double price) {
        this.idRef = idRef;
        this.estilo = estilo;
        this.color = color;
        this.talla = talla;
        this.stock = stock;
        this.imagenURL = imagenURL;
        this.price = price;
    }

    //constructor sin ID
    public Jeans( String estilo, String color, String talla, int stock, String imagenURL, double price) {
       
        this.estilo = estilo;
        this.color = color;
        this.talla = talla;
        this.stock = stock;
        this.imagenURL = imagenURL;
        this.price = price;
    }


// getters

    public int getIdRef() { return idRef;}

    public double getPrice() { return price;}

    public String getEstilo() { return estilo;}

    public String getColor() { return color;}

    public String getTalla() { return talla;}

    public int getStock() { return stock;}

    public String getImagenURL() { return imagenURL;}


    // seters    
    public void setIdRef(int id) { this.idRef = id;}

    public void setPrice(double price) { this.price = price;}

    public void setEstilo(String estilo) { this.estilo = estilo;}

    public void setColor(String color) { this.color = color;}

    public void setTalla(String talla) { this.talla = talla;}

    public void setStock(int stock) { this.stock = stock;}

    public void setImagenURL(String img) { this.imagenURL = img;}
   
}
