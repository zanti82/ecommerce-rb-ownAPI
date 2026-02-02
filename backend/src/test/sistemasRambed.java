package test;
/**
 * Manejo de una tienda virtual de jeans, donde tenemos las clases
 * Administradores, Clientes que herdan de la superclase User.
 * Tambien tenemos las clases Jeans que maneja el inventario.
 * La clase TiendaRB maneja las listas de los clinentes, administradores y productos.
 */


import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Scanner;

import DAO.StatementsAdmin;
import DAO.UserDAO;
import DAO.JeansDAO;
import conexion.conexionJDB;
import model.Admin;
import model.Cliente;
import model.Factura;
import model.Jeans;
import model.TiendaRB;
import model.User;



public class sistemasRambed {
   
   //variables para registro de clientes

    static Scanner  read=new Scanner(System.in); //variable global
    static int opIncial=0;
    static char opCliente;

    //variables para comprar jeans

    static char op;
    static double ventaTotal=0;
    static int cont=0;

    
    public static void main(String[] args) {

        //BLOQUE PARA BASE DE DATOS

        Connection pruebaConn = conexionJDB.conectar();

        if (pruebaConn != null) {
            System.out.println("RESULTADO: ¡La conexión es EXITOSA!");
            // 3. Cerrar la conexión si se estableció
            conexionJDB.cerrar(pruebaConn);
        } else {
            System.out.println("RESULTADO: La conexión FALLÓ. Revisa la URL, credenciales y driver.");
        }
        System.out.println("--- PRUEBA FINALIZADA ---");

              
       
        //BLOQUE PARA GAUARDAR CLIENTES, ADMINISTRADORES, JEANS

        ArrayList<Admin> listaAdmin= new ArrayList<>();
        ArrayList<Cliente> listaClientes= new ArrayList<>();
        ArrayList<Jeans> listaJeans= new ArrayList<>();
        ArrayList<Factura> listaFacturas=new ArrayList<>();

        TiendaRB tiendaVirtualRB= new TiendaRB(listaJeans, listaClientes, listaAdmin, listaFacturas);

        System.out.println("************************************************************");
        System.out.println("*************************LISTA CLIENTES*********************");
        System.out.println("************************************************************");

        UserDAO queryClientes= new UserDAO();

        try {
            listaClientes=queryClientes.obtenerTodosClientes();
        } catch (SQLException e) {
           
            e.printStackTrace();
        }

        for (Cliente c : listaClientes) {
            System.out.println("id:"+c.getId() +
                               " - nombre: "+c.getName() );
            
        }
     

     System.out.println("************************************************************");
     System.out.println("*************************guardar cliente**************");
     System.out.println("************************************************************");
 
         UserDAO saveCl = new UserDAO();
         Cliente cl1= new Cliente("1321", "nuevo", "n@m.com", "2121", "21111", "crrnueva");

         
 
         try {
             saveCl.guardar(cl1);
         } catch (SQLException e) {
            
             e.printStackTrace();
         }
 
         try {
            listaClientes=queryClientes.obtenerTodosClientes();
        } catch (SQLException e) {
           
            e.printStackTrace();
        }

        for (Cliente c : listaClientes) {
            System.out.println("id:"+c.getId() +
                               " - nombre: "+c.getName() );
            
        }
  
             
         
        
        System.out.println("************************************************************");
        System.out.println("*************************LISTA ADMINISTRADORES**************");
        System.out.println("************************************************************");

        StatementsAdmin newqueryAdmin = new StatementsAdmin();

        try {
            listaAdmin=newqueryAdmin.obtenerTodosAdmins();
        } catch (SQLException e) {
           
            e.printStackTrace();
        }

        for (Admin a : listaAdmin) {
            System.out.println("id:"+ a.getId() +
                               " - nombre: "+ a.getName() );
            
        }

        /* 
        //aca creo los admin ESTO ES VIEJO ANTES DEL SQL
        Admin adm1= new Admin("100234","Julian", "julina@mail.com", "1111","32100000",  "crr 20");
        Admin adm2= new Admin("100235","Maricela", "maricela@mail.com", "2222","32100033",  "calle 22");
        Admin adm3= new Admin("100236","MariaJ", "maria@mail.com", "3333","32100022",  "crr 30");
        Admin adm4= new Admin("100237","Santiago", "santi@mail.com", "4444","32100044",  "cll 49");
      
        //los anexamos al arraylist instanciando una clase tienda
        /**
         * La clase tienda recoge la informacion de las listas de administradores, cliente y productos
         * Queda faltando la de las facturas
         

        

        tiendaVirtualRB.addAdmin(adm1);
        tiendaVirtualRB.addAdmin(adm2);
        tiendaVirtualRB.addAdmin(adm3);
        tiendaVirtualRB.addAdmin(adm4);
        */   
        
        
        //creación de objetos jeans para tener una lista

    System.out.println("************************************************************");
    System.out.println("*************************LISTA JENAS**************");
    System.out.println("************************************************************");

        JeansDAO newqueryJeans = new JeansDAO();

        try {
            listaJeans=newqueryJeans.obtenerTodasRef();
        } catch (SQLException e) {
           
            e.printStackTrace();
        }

        for (Jeans j : listaJeans) {
            System.out.println("id:"+ j.getId() +
                               " - nombre: "+ j.getEstilo() );
            
        }
      
/* 
        Jeans ref1= new Jeans(1001,"ClasicoDenim", 89000);
        Jeans ref2= new Jeans(1002,"ClasicoDril", 89000);
        Jeans ref3= new Jeans(1003,"CargoDril", 110000);
        Jeans ref4= new Jeans(1004,"CargoDemin", 110000);

        //anexamos jeans al arraylist de listajeans por medio de la tienda

        tiendaVirtualRB.addRef(ref1);
        tiendaVirtualRB.addRef(ref2);
        tiendaVirtualRB.addRef(ref3);
        tiendaVirtualRB.addRef(ref4);
        
        
 */       
        
        // BLOQUE FACTURAS con arrays simples
        int contFac=0;
    
        String [] facturas=new String[20];
        Double [] valorFact= new Double[20];

           
              
    //inicio del programa **************

            

        System.out.println("******************************");
         System.out.println("WELCOME TO RAMBED JEANS");
        System.out.println("******************************");

        System.out.println("ESCOGE UNA OPCION \n 1. CLIENTE \n 2. ADMINISTRADOR \n 3. SALIR ");
        opIncial=read.nextInt();

        while(opIncial != 3){

            switch(opIncial){

                case 1: {
                
                    System.out.println("WELCOME TO RAMBED JEANS");
                    System.out.println("Estas registrado? \n S/N");
                    opCliente=read.next().charAt(0);
                    
                    if (opCliente=='n' || opCliente=='N') {
                       
                        ingresoCliente(tiendaVirtualRB); //llamamos la funcion que es statica

                        
                    }else if(opCliente=='s' || opCliente=='S'){

                       

                        boolean loggin= login(listaClientes); //capturamos el return de la fucnon login en la variable loggin
                        
                        if(loggin==true){

                        
                            System.out.println("**************************************");
                            System.out.println("estas en la pagina de ventas, \n  este es la lista de jeans:");
                            System.out.println("**************************************");
                            System.out.println("OPCION \t JEANS \t\t PRECIO ");
                                                       
                            //aca listamos les desde la tienda

                            tiendaVirtualRB.listarJeans();
                                                                                     
                            System.out.println("**************************************");

                            System.out.println("Quieres agregar una compra S/N");
                            op=read.next().charAt(0);
                                

                                while (op == 's' || op == 'S' ) {

                                    //usamos la funcion comprar 

                                    double venta= comprar(listaJeans);  //guardamos le return en una variable            

                                    ventaTotal=venta+ventaTotal;
                                    cont++;

                                    System.out.println("Quieres agregar una compra S/N");
                                    op= read.next().charAt(0);
                                    
                                }

                                System.out.println("************************************");
                                System.out.println("Usted compró:.... "+cont+" items .......total: " +ventaTotal+" $");
                                
                                System.out.println("************************************");
                                System.out.println("************************************");
                
                                facturas[contFac] = "100"+contFac;
                                valorFact[contFac]= ventaTotal;

                                System.out.println("FACTURA NRO: "+ facturas[contFac]);
                                
                                contFac++;

                                    //FIN BLOQUE VENTAS DEL CLIENTE
                                                                                            
                            }else{
                                System.out.println("Error en usuario y constraseña");
                            };

                           
                       //esto para cambiar el switch

                        System.out.println("ESCOGE UNA OPCION \n 1. CLIENTE \n 2. ADMINISTRADOR \n 3. SALIR ");
                        opIncial=read.nextInt();
                        
                       

                    }
                } break;

                case 2: { 
        
                    System.out.println(listaAdmin);
                        
                        //llamamos la funcion loggin tipo T para los admins
                        boolean loggin=login(listaAdmin);

                        if(loggin){                                   
                                                    
                        //BLOQUE ADMIN
                        System.out.println("**********************************************");
                        System.out.println("HOLA SUPER ADMINISTRADOR, QUE DESEAS HACER HOY");
                        System.out.println("1. Editar producto \n 2. Resumen de ventas \n 3. Salir");
                        int opad=read.nextInt();

                        while (opad!=3) {
                                          
                            switch (opad) {
                                case 1:
                                    System.out.println("Este es el listado de los jeans en bodega ");
                                    System.out.println("OPCION \t JEANS \t\t PRECIO ");

                                        //usmaos el metodo de la tiendaRB
                                        tiendaVirtualRB.listarJeans();;
                                    
                                    System.out.println("seleccion la opcion");
                                    System.out.println("1. Editar referencias \n 2. Agregar referencias \n 3. salir");
                                    int ops=read.nextInt();
                                            
                                    while(ops!=3){
                                        switch (ops) {
                                            case 1:
                                                System.out.println("introduce la referencia que deseas editar");

                                                int editRef=read.nextInt();

                                                ArrayList<Jeans> listajeans= tiendaVirtualRB.getListaJeans();

                                                editarJeans(listajeans, editRef);

                                               
                                                tiendaVirtualRB.listarJeans();

                                                    
                                                break;
                
                                            case 2:
                                                    //caputramos el return de la funion crearJeans

                                                Jeans jeansNew= crearJeans();
                                                tiendaVirtualRB.addRef(jeansNew);
                                                
                                                System.out.println( "Ingresaste= "
                                                +"\n ref: "+jeansNew.getId()+
                                                "\n estilo: " +jeansNew.getEstilo()+
                                                "\n precios:"+jeansNew.getPrice());
                                                            
                                                break;
                                        
                                        
                                            default:
                                                    System.out.println("opcion errada, intenta de nuevo");
                                                    
                                                    break;
                                            };

                                                System.out.println("seleccion la opcion");
                                                System.out.println("1. Editar productos \n 2. agregar \n 3. salir");
                                                ops=read.nextInt();
                                        }
                                        System.out.println("**********************************************");
                                        System.out.println("HOLA SUPER ADMINISTRADOR, QUE DESEAS HACER HOY");
                                        System.out.println("1. Editar producto \n 2. Resumen de ventas \n 3. Salir");
                                        opad=read.nextInt();
                                    
                                    break;
                    
                                    case 2:
                                        System.out.println("LISTANDO FACTURAS ");
                                        System.out.println("NUMERO FACT \t VALOR ");


                                        for(int i=0;i<facturas.length;i++){
                                                    if(facturas[i]!= null){
                                                                    
                                                System.out.println( facturas[i]+"\t"+valorFact[i]);
                                                    }
                                                else{ 
                                                    System.out.println("no hay facturas registradas");
                                                }
                                            
                                                };
                                            
                                        System.out.println("**********************************************");           
                                        System.out.println("HOLA SUPER ADMINISTRADOR, QUE DESEAS HACER HOY");
                                        System.out.println("1. Editar producto \n 2. Resumen de ventas \n 3. Salir");
                                        opad=read.nextInt();  

                                    break;

                                                                            
                                    default: System.out.println("opcion errada vuelve a intentarlo");
                                            
                                    break;
                
                                    }
                                
                        }

                        }else{

                            System.out.println("Error en usuario y constraseña");
                               
                        }
                    
                        
                  
                    System.out.println("/////////////////////////////////////////////////////////");
                    System.out.println("ESCOGE UNA OPCION \n 1. CLIENTE \n 2. ADMINISTRADOR \n 3. SALIR ");
                    opIncial=read.nextInt();
                
                }
                break;

                case 3: {

                    opIncial=3;
                }
                default: {
                    System.out.println("opcion incorrecta, le bien y entre los datos bien");
                   
                }
                System.out.println("/////////////////////////////////////////////////////////");
                System.out.println("ESCOGE UNA OPCION \n 1. CLIENTE \n 2. ADMINISTRADOR \n 3. SALIR ");
                opIncial=read.nextInt();

            }
            } 
            
            System.out.println("****************THANKS FOR USE IT*********************");
            System.out.println("******************SOFTWARE 2MSJ***********************");
            System.out.println("ELABORATE FOR MARICELA, MARIAJOSE, JULIAN  Y SANTIAGO");

            read.close();   
    }



    //FUCIONES 

    public static void ingresoCliente(TiendaRB tienda){

        System.out.println("ingresa tu Cedula ");
        String clienteId= read.next();
        System.out.println("ingresa tu nombre ");
        String clienteName= read.next();
        System.out.println("ingresa tu email ");
        String clienteMail= read.next();
        System.out.println("ingresa tu pass ");
        String clientePass= read.next();
        System.out.println("ingresa tu phone ");
        String clientePhone= read.next();
        System.out.println("ingresa tu direccion ");
        String clienteAddress= read.next();

        //con la info capturada creeamos clientes con la siguiente instruccion
        //aca lo guardamos en el arraylist de la tiendaviertual de listaClinetes

        tienda.addClientes(new Cliente(clienteId, clienteName, clienteMail, clientePass, clientePhone, clienteAddress));
                              
        //ensayis
        tienda.getListClientes();

       

    }

    /**
     * Usamos un loggin con generico tipo T para lo pueda usar el cliente o el admin
     */

    public static <T extends User> boolean login( ArrayList<T> listaUsuarios){

        System.out.println("ingresa tu email ");
        String nUserMail= read.next();
        System.out.println("ingresa tu pass ");
        String nUserPass= read.next();

        boolean loggin=false;

        for (User u: listaUsuarios) {

            if(u.getMail().equals(nUserMail) && u.getPassword().equals(nUserPass)){

                    loggin=true;

                System.out.println("Loggin exitoso");

            }else{
                

            }    
        }
            return loggin;
    }         
    
    
    public static void editarJeans(ArrayList<Jeans> listaJeans, int ref){
        
        for(int i=0;i<listaJeans.size(); i++){
                                                        
            Jeans jeans= listaJeans.get(i);
            if(jeans.getId() == ref){

                System.out.println("ingresa el nombre: ");
                String cambioNom=read.next();
                jeans.setEstilo(cambioNom);
                

                System.out.println("ingresa el valor: ");
                double  cambioPrec=read.nextDouble();
                jeans.setPrice(cambioPrec);

                System.out.println("la referencia "+jeans.getId()+" ha sido editada con exito");
             
            }
        }
    }

    public static Jeans crearJeans(){
        System.out.println("Vamos a agregar una ref nueva: ");
                                                            
        System.out.println("ingresa el id: ");
        int newId=read.nextInt();
                                    
        System.out.println("ingresa el estilo: ");
        String newNom=read.next();
                                    
        System.out.println("ingresa el valor: ");
        double  newPrec=read.nextDouble();

        Jeans nuevoJeans= new Jeans(newId, newNom, newPrec);

        return nuevoJeans;


    }

    public static Double comprar(ArrayList<Jeans> listaJeans){

        System.out.println("escoge el numero de la ref del jean: ");
        int opcion=read.nextInt();
        System.out.println("cuantas unidades quieres de este jean ?:  ");
        int und= read.nextInt();

        double valorjean=0;
        double venta=0;
        
        for(int i=0;i<listaJeans.size(); i++){

            Jeans jeans= listaJeans.get(i);
            if(jeans.getId() == opcion){

                 valorjean= jeans.getPrice();

                 venta= und * valorjean;

                 System.out.println("Usted compro ref: "+jeans.getEstilo()+
                 " und: "+ und + " valor: "+ venta);
            }

        }
        return venta;

    }
}

