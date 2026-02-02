

//*****************************************************************************//
//**********************VARIABLES GLOBALES*******************************************************//


let carritoCompra=[]; //array para anexar la compras
let contadorCarrito= document.getElementById("verCarrito") //contador del carrito

let compras=[]; // array para las compras
let compra;

let facturasCompras=[]; //array para gaurdar las facturas
let factura; //variable que crea facturas
let numFactura= 1000;

//descaragamos el locla y actualziamos el carrito en esta pagina
const CARRITO_LOCAL_STORAGE= "listaCarrito";

carritoCompra = CargarDatosCarritoLS();
console.log(carritoCompra)

actualizarContadorCarrito();

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
        duration: 3000, 
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


//funcion para actualizar visualmente el carrito

function actualizarContadorCarrito() {
     contadorCarrito.textContent = `🛒 Carrito (${carritoCompra.length})`;
}


//-----------------VER CARRITO DE COMPRAS------------------//

//declaramos las variables globales
let sumTotal=0;
let itemsCarrito = document.getElementById('itemsCarrito');
let totalCarrito = document.getElementById('carritoTotalFinal');


function crearTablaCarrito(){
    //actualizamos la tablas vacia

    itemsCarrito.innerHTML=" "; //vaciamos
    

    if(carritoCompra.length === 0){
        itemsCarrito.innerHTML = '<p style="text-align:center; padding: 20px;">Tu carrito está vacío 😔.</p>';
        sumTotal = 0;
    }else{
        carritoCompra.forEach((jeans, index) => {
            
            //creamos el item con los dettalles
            let item = document.createElement('div');
            item.className = 'carrito-item';

            let estilo = document.createElement('span');
            estilo.className = 'item-estilo';
            estilo.textContent = `${jeans.estilo} (x${jeans.cantidad})`;

            
            let total = document.createElement('span');
            total.className = 'item-total';
            total.textContent = `$${jeans.valorTotal}`; 

            //creamos le boton que hayq ponelro a funcionar, por eso necesito le index

            let eliminar = document.createElement('button');
            eliminar.className = 'btn-eliminar';
            eliminar.textContent = 'Eliminar';
            
            eliminar.setAttribute('data-index', index); //usamo le index para luego saber que borramos
            
            //click
            eliminar.addEventListener('click', eliminarItemDelCarrito);

            //anexamos todo
            item.appendChild(estilo);
            item.appendChild(total);
            item.appendChild(eliminar);
            itemsCarrito.appendChild(item);
           
            sumTotal += jeans.valorTotal;

            });      

    }   totalCarrito.textContent = `$${sumTotal}`; 
    
}

crearTablaCarrito();

/********** funciones para amnejo del local storge carrito */
function CargarDatosCarritoLS(){
    return JSON.parse(localStorage.getItem(CARRITO_LOCAL_STORAGE)) || [];
  
}

function guardarDatosCarritoLS(listaCarrito){
    localStorage.setItem(CARRITO_LOCAL_STORAGE,JSON.stringify(listaCarrito));
}

function eliminarCarritoLS(){
    localStorage.removeItem(CARRITO_LOCAL_STORAGE);

}

//--------FUNCIONES PARA ABRIR EL CARRITO Y CERRARLO-------------//

let listaCarrito= document.getElementById("verCarrito")
const btnVaciarCarrito = document.getElementById('btnVaciarCompra');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');



listaCarrito.addEventListener("click", ()=>{
   
    crearTablaCarrito();
    
})


btnSeguirComprando.addEventListener("click", ()=>{

    window.location.href = 'hombre.html';

})

btnVaciarCarrito.addEventListener("click", ()=>{

   vaciarCarrito();
   console.log("Estado del Carrito:", carritoCompra);
   eliminarCarritoLS();
   guardarDatosCarritoLS(carritoCompra);
   console.log(carritoCompra);


})

function vaciarCarrito(){
   carritoCompra=[]
   crearTablaCarrito();
   actualizarContadorCarrito();

}

function eliminarItemDelCarrito(e){
    let index=parseInt( e.target.getAttribute("data-index"));
    console.log(index);
    carritoCompra.splice(index,1);
    crearTablaCarrito(); //actualizamos de neuvo el carrrito y el contador
    actualizarContadorCarrito();
    console.log("Estado del Carrito:", carritoCompra);
    guardarDatosCarritoLS(carritoCompra)
   
}

const FACTURAS_LOCALSTORAGE_KEY = 'facturas'; //esta variable para usarlo en el local storage




btnFinalizarCompra.addEventListener(`click`,() => {

    if(carritoCompra.length===0){
        //tostify
         alertTosty(`¡NO hay nada en el carrito!`,`error` )
        return;
    }
    if(!usuarioActivo){

        //tostify
         alertTosty(`No te has loggeado`,`error` )
         vaciarCarrito()
        return;
    }

    factura={ numFactura: numFactura++,
        fecha : new Date().toLocaleDateString(),
        comprador : usuarioActivo.nombre,
        nitComprador : usuarioActivo.cedula,
        items : [...carritoCompra],
        total : sumTotal

    }

    facturasCompras.push(factura);
    verFacturas();
    vaciarCarrito();
    actualizarContadorCarrito();
    crearTablaCarrito(); //actualizamos de nuevo el carrrito y el contador

    alertTosty(`factura cargada con exito`,`ok` )
    console.log("Factura Creada:", factura);
    
  
    eliminarCarritoLS();

    console.log(carritoCompra);

   

    

    //GUARDAMOS LAS FACT EN LOCALSTORAGE
    guardarFacturasLocalStorage();

})

function verFacturas(){ //listamos las facturas

    if(factura.length===0){
        alertTosty(`no hay compras registardas`,`error`);
    }else{

        let resumenItems = factura.items.map((item) => 
            ` - ${item.estilo} (x${item.cantidad}) - $${item.valorTotal.toFixed(2)}`
        ).join('\n'); // Junta todos los ítems con saltos de línea

        
       // 1. Convertimos los saltos de línea (\n) a etiquetas <br> de HTML.
    const detalleHTML = resumenItems.replace(/\n/g, '<br>');

    // 2. Usamos SweetAlert2
    Swal.fire({
        title: '🎉 ¡COMPRA EXITOSA! 🎉',
        icon: 'success',
        // Usamos 'html' para inyectar nuestro contenido formateado
        html: `
            <div style="text-align: left; margin: 0 auto; max-width: 300px;">
                
                <p><b>Cliente:</b> ${usuarioActivo.nombre}</p>
                <p><b>Nro. Factura:</b> ${factura.numFactura}</p>
                
                <hr>
                <p style="font-weight: bold;">Detalle de la Compra:</p>
                
                <p style="font-size: 0.9em;">${detalleHTML}</p> 
                
                <hr>
                <h3>TOTAL PAGADO: $${factura.total.toFixed(2)}</h3>
                <br>
                <h3>ENVIO PROGRAMADO PARA: ${usuarioActivo.direccion}</h3>
            </div>
        `,
        confirmButtonText: 'Guardar Factura',
    });

    }
}

//*********************guardar facturas en el local storage  ******************************/

function guardarFacturasLocalStorage() {
   
    //convertimoS el array facturas a JSON

    const facturasJSON = JSON.stringify(facturasCompras);
    
    // Guardar esa cadena de texto en LocalStorage. Necesita dos parametros key y value
    localStorage.setItem(FACTURAS_LOCALSTORAGE_KEY, facturasJSON);

    //tostify
     alertTosty(`Factura guardad exitosamente LS`,`ok`);
}

function obtenerFacturasLocalStorage(){ 
    // esta funcion la podemos llamar al incio para cargar datos guardados
    const facturas_LS_JSON = localStorage.getItem(FACTURAS_LOCALSTORAGE_KEY);
    

    if(facturas_LS_JSON){
        const facturasCargadas = JSON.parse(facturas_LS_JSON); 
        //validamos datos en array
        console.log(facturasCargadas);
        console.log("hay FACTURAS guardadas en LS");

        //pasamos lo datos al array global del programa
        facturasCompras = facturasCargadas;
    }else{
        console.log(`no hay facturas guardadas en el localStorage--there are not INVOICES saved in localStorage`)
    }
    

}





