package model;
/*Esta clase crea objetos tipo usuarios */

public class User {

    private int id; //name of the user
    private String documento; // iD of user
    private String name; //name of the user
    private String mail; //mail of user
    private String password; // password of user
    private String phoneNumber; //numero tel
    private String address; // direccion
    private String role;
    
    

    //CONSTRUCTOR vacio para gson  

    public User() {
    }

    //CONSTRUCTOR con id para leer datos

   
    public User(int id, String documento, String name, String mail, String password, String phoneNumber, String address, String role) {
        this.id = id;
        this.documento = documento;
        this.name = name;
        setMail(mail); //Aqui usamos le setter para validar
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.role = role;
    }

    //CONSTRUCTOR without ID, this when I want to creat a new user, the id is auto increment
    
   
    public User(String documento, String name, String mail, String password, String phoneNumber, String address, String role) {
        
        this.documento = documento;
        this.name = name;
        setMail(mail); //Aqui usamos le setter para validar
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.role = role;
    }



    //METODOS GET

    public int getId() { return id; }

    public String getDocumento() { return documento; }

    public String getName() { return name;}

    public String getMail() {return mail;}

    public String getPassword() { return password;}

    public String getPhoneNumber() {return phoneNumber;}

    public String getAddress() {return address; }

    public String getRole(){ return role;}

   
   
    // METODOS SET
   
    public void setId(int id) { this.id = id; }
    
    public void setDocumento(String documento) {this.documento = documento;}
      
    public void setName(String name) { this.name = name;}
    
    // validacion del correo 
    public void setMail(String mail) { 
       
            if( mail == null || !mail.contains("@") || !mail.contains(".")){
                throw new IllegalArgumentException("Email invalido/Email is invalid");
            }
                this.mail= mail;
                  
    }
    
    public void setPassword(String password) {this.password = password; }
    
    public void setPhoneNumber(String phoneNumber) {this.phoneNumber = phoneNumber;}
   
    public void setAddress(String address) {this.address = address; }

    public void setRole(String role){ this.role = role;} 

   

   
    /* ESTE METODO SE NECESITA, PERO NO ES TAREA  DE LA CLASE USER
    VA A SER TAREA DE UNA CLASE QUE AUNTENTIQUE EL LOGGIN
    public boolean loggin(String mail, String password){

        boolean loggin=false;
        if(this.mail.equals(mail) && this.password.equals(password)){
            System.out.println("bienvenido entrada exitosa");
            loggin=true;
        }else{
            System.out.println("email y password son incorrectos");
            loggin=false;
        }

        return loggin;

    }*/

    // Métodos de utilidad
    public boolean isAdmin() {
        return "ADMIN".equals(role);
    }
    
    public boolean isCliente() {
        return "CLIENTE".equals(role);
    }


    // CAMBIAMOS EL METODO TO STRING DE LA CLASE TO STRING PARA QUE MUSTRE LA INFO
    @Override
    public String toString() {
        return "Nombre: -" + name + " ,Cedula:- "+id+ ", Email:- "+ mail+ " pass: -"
        +password+" Address:- "+address+" Phone: -"+phoneNumber+ " ,role:- "+role;
    }

  
    
}
