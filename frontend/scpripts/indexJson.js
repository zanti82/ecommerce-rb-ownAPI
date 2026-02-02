//*************************************************************//
//*******************PROMESA ASYNCRONA cargar catalogo****************************//

const URL="/scpripts/stock.json"

let stock=[];

async function fetchJsonRB() {

    
    try {   
          
            let response =  await fetch(URL); //capturamos al promesa

             console.log(response) //validamos la promesa

            if(!response.ok){
                throw new Error (`Error ${response.status}`);
            }
            
            let listaJeansJSON = await response.json();
            console.log("succesfull");

           
           //paresamos los datos tipo nuemro y float
           

            listaJeans= listaJeansJSON.stock.map((jeans)=> {
                return {
                    id : parseInt(jeans.id),
		        estilo : jeans.estilo,
                precio : parseFloat(jeans.precio),
		        img : jeans.img,
                descuento : parseInt(jeans.descuento),
		        tallas: jeans.tallas }         
                
            })

          
            mostrarCatalogo()
           
               
        
    } catch (error) {
        
        
        Swal.fire({
            title: '¡no se cargaron los datos de la promesa!',
            html: `
                  <p>¡ERROR EN  JSON ${error}!</p>
            `,
            icon: 'warning', // (success, error, warning, info, question)
            confirmButtonText: 'revisar', 
         })
        throw error;

    }
     finally{
        console.log("promesa comppletada completada")

     }

     console.log(listaJeans)
    
}

fetchJsonRB();

//*********************usuario activo************************* */
const User= document.getElementById("usuarioActivo"); //ususario

let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioActivo) {
        User.style.display= "block";
        User.textContent = `hola ${usuarioActivo.nombre} -  LOG OUT`
        console.log(usuarioActivo)
    }

User.addEventListener("click",()=>{
    
        localStorage.removeItem("usuarioActivo");
        alert("has salido")
    
        console.log(usuarioActivo)
        User.style.display= "none";

}
)

/*************************************cargar usuarios************* */

function CargarDatosUsuariosLS(){
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  
}

let ususarios = CargarDatosUsuariosLS();
console.log(ususarios);


//*****************************************************************************//
//**********************VARIABLES GLOBALES*******************************************************//


let carritoCompra=[]; //array para anexar la compras
let contadorCarrito= document.getElementById("verCarrito") //contador del carrito

let compras=[]; // array para las compras
let compra;

let facturasCompras=[]; //array para gaurdar las facturas
let factura; //variable que crea facturas
let numFactura= 1000;

const CARRITO_LOCAL_STORAGE= "listaCarrito";

carritoCompra=CargarDatosLS();
actualizarContadorCarrito();


//*****************************************************************************//
//******************************DOM***********************************************//

//FUNCION PARA USAR EL TOSTIFY CON VARIOS COLORES, PARA MOSTRAT ALERTAS BONITAS

function alertTosty(mensaje, tipo = '') {
    let backgroundColor;

    switch (tipo) {
        case 'ok':
            backgroundColor = "rgb(27, 181, 19)"; 
            break;
        case 'error':
            backgroundColor = "rgb(216, 81, 8)";
            break;
        case 'info':
        default:
            backgroundColor = "rgb(29, 216, 213)"; 
            break;
    }

    Toastify({
        text: mensaje,
        duration: 2000, 
        newWindow: true,
        gravity: "top", 
        position: "right", 
        style: {
            background: backgroundColor,
            borderRadius: "5px"
        },
        onClick: function(){} // Callback al hacer clic en el toast
    }).showToast();
}

//****************FUNCION PARA MOSTRAR CATALOGO**************************/

function mostrarCatalogo(){
   
    //obtenenos el catalogo que va con el grid

   const catalogoContainer = document.querySelector(".container-products");

   //hacemos un forEach para crear cada elemento de la lista de jenas y ponerlos el html

   listaJeans.forEach(jeans => {
           
           let product_card = document.createElement("div");
           product_card.className="card-products";

           // Asignamos el ID del producto como atributo de datos para facilitar el manejo
           product_card.setAttribute('data-id', jeans.id); 

           // creamos div de la imagen

           let contImagen = document.createElement("div");
           contImagen.className="container-img";
           
           let img =  document.createElement("img");
           let descuento =  document.createElement("span");
           descuento.className = "discount";

           contImagen.appendChild(img);
           contImagen.appendChild(descuento);

            //div de la info del producto
           let contProducto = document.createElement("div");
           contProducto.className="content-card-product";
           
           let h3 =  document.createElement("h3");
           let addCar =  document.createElement("span");
           addCar.className = "add-cart";
           let iconCar = document.createElement("i");
           iconCar.classList.add("fa-solid","fa-basket-shopping");
           let precio = document.createElement("p");
           precio.className= "price";
                 
           
           addCar.appendChild(iconCar);

           contProducto.appendChild(h3);
           contProducto.appendChild(addCar);
           contProducto.appendChild(precio);
           

          
           addCar.setAttribute('data-id', jeans.id);  // Al botón también le pasamos el ID
            iconCar.setAttribute('data-id', jeans.id);
           //agregamos los atibutos de la lista jeans

           img.src=`${jeans.img}`;
           img.alt=`${jeans.estilo}`

           h3.textContent = jeans.estilo.toUpperCase();
           let precioUp= jeans.precio * 1.1;
           precio.innerHTML = `$${jeans.precio} <span class="priceUp"> $${precioUp.toFixed(0)}</span>`;
           descuento.textContent = `${jeans.descuento}%`
         
           //agregamos todo al html con apenndchild

           product_card.appendChild(contImagen);
           product_card.appendChild(contProducto);
           

           catalogoContainer.appendChild(product_card);

           //----------------logica de agregar al carro-----------------//

           addCar.addEventListener('click', agregarAlCarrito); 

       })

}

function agregarAlCarrito(e){ 
    //la "e" el evento click
    //capturamos el ID del boton
    let id= parseInt(e.target.getAttribute("data-id"));

    let cantidadUser= parseInt(prompt("ingresa la cantidad deseada"));

    if(isNaN(cantidadUser)){
        Swal.fire({
            title: 'Ingrese un mumero valido',
            icon: 'warning',
            // Usamos 'html' para inyectar nuestro contenido formateado
            confirmButtonText: 'ok',
        });
        return;
    }
    
    
    console.log("ID Seleccionado:", id); //validacion en el consolg PARA BORRAR

    let jeanSeleccionado = listaJeans.find((jeans) => {
       return jeans.id === id;
    })

    if(jeanSeleccionado){
         compra={ id:jeanSeleccionado.id,
                estilo: jeanSeleccionado.estilo, 
                cantidad: cantidadUser,
                valorTotal: jeanSeleccionado.precio * cantidadUser,
                }
        
         carritoCompra.push(compra); //subimos la compra al array del carrito

        //validamos //PARA BORRAR
        console.log("jean agregado:", compra);
        console.log("Estado del Carrito:", carritoCompra);
    
        
        
        actualizarContadorCarrito(); //Actualizamos el carrito de compra

        guardarDatosLS(carritoCompra);

        //confirmamos la seleccion del articulo alert  POR EL TOSTIFY
          
        alertTosty(`¡${jeanSeleccionado.estilo} agregado al carrito!`,`ok` )
       
            
    }

}

//funcion para actualizar visualmente el carrito

function actualizarContadorCarrito() {
     contadorCarrito.textContent = `🛒 Carrito (${carritoCompra.length})`;
}


//-----------------VER CARRITO DE COMPRAS------------------//

contadorCarrito.addEventListener("click", ()=>{
    window.location.href = 'carrito.html';
})




/********** funciones para amnejo del local storge carrito */
function CargarDatosLS(){
    return JSON.parse(localStorage.getItem(CARRITO_LOCAL_STORAGE)) || [];
  
}

function guardarDatosLS(listaCarrito){
    localStorage.setItem(CARRITO_LOCAL_STORAGE,JSON.stringify(listaCarrito));
}



