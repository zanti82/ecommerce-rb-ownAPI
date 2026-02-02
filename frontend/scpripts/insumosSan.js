//___________________________________________________//
//**************CRUD PARA ITEMS*********************//
//___________________________________________________//


//CAPTURAMOS LOS ITEMS DEL HTML

const formularioCrud = document.getElementById('signupForm');
const tbodyTabla = document.getElementById("tbody1"); 
const formId =  document.getElementById('id');
const formNombre =  document.getElementById('name');
const formDescrip = document.getElementById('descrip');
const formCateg = document.getElementById('categ');
const formUnd = document.getElementById('und');


const btnUpdate = document.getElementById("btnActualizar"); //boton oculto
const btnCancelar = document.getElementById("btnCancelar"); //boton oculto

//CARGAMOS LA PAGINA CON LA TABLA Y LIMPIAR INPUTS

document.addEventListener('DOMContentLoaded', mostrarTabla);
document.addEventListener('DOMContentLoaded', limpiarDatos); 


//CONSTRUCCION DE UN OBJETO

let Insumos;

class insumo{
    constructor(id, nombre, descripcion, categoria, und){
        this.id=id;
        this.nombre=nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.und = und;
    }
}




//********** funciones para amnejo del local storge */
const INSUMOS_LOCAL_STORGE= "insumos";

function CargarInsumosLS(){
    return JSON.parse(localStorage.getItem(INSUMOS_LOCAL_STORGE)) || [];
  
}

function GuardarInsumosLS(insumos){
    localStorage.setItem(INSUMOS_LOCAL_STORGE,JSON.stringify(insumos));
}


//array para Usuarios, para ensayis luego tomamos el localstoge

Insumos=CargarInsumosLS();

/*let ins1= new insumo(22,"cortadora extremos","COrtadora final mesa","corte",1 )
Insumos.push(ins1);

GuardarInsumosLS(Insumos);
Insumos= CargarInsumosLS();*/ // esto es para caragr el local storgae


console.log(Insumos)


//********************************PARA LOGOUT Y USUARIO */

const User= document.querySelector(".logout-link"); //ususario

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

        window.location.href = "index.html"; 



}
)

//******************************* */
//funcion para crear nuevo inusmo
//******************************* */

formularioCrud.addEventListener('submit', (e) =>{
    e.preventDefault();

    const idN = parseInt(formId.value);
    const nombreN =  formNombre.value;
    const descripN = formDescrip.value;
    const categN = formCateg.value;
    const undN = parseInt(formUnd.value);
    

    // cargaos los inusmos del LS a la variable
    let Insumos=CargarInsumosLS();

    const validarId = Insumos.find(insumo => insumo.id === id);

    if(validarId){
        alert('Este insumo ya se encuentra registrado');
    }else{

        let newInsumo= new insumo (idN, nombreN, descripN, categN, undN)
        Insumos.push(newInsumo);
        
        GuardarInsumosLS(Insumos);
        alert('Insumo registrado con exito');
     
    }
    limpiarDatos()
    mostrarTabla()
    

    });



// ***limpiar datos de inputs
function limpiarDatos(){
    
    formId.value = "";
    formNombre.value = "";
    formDescrip.value = "";
    formCateg.value = "";
    formUnd.value = "";
}

function mostrarTabla(){

    //cargamosloq ue etsa guardado en LS
    Insumos= CargarInsumosLS();
    
   let html=""; //variable html para sumar las filas

    //crear filas de la tabla por medio del html
 
    
    Insumos.forEach(function(insumo,index){

        html+= `<tr>
                    <th scope="row">${index}</th>
                    <td>${insumo.id}</td>
                    <td>${insumo.nombre}</td>
                    <td>${insumo.descripcion}</td>
                    <td>${insumo.categoria}</td>
                    <td>${insumo.und}</td>
                  
                    <td>
                        <button onclick="actualizarInsumo(${insumo.id})" class="btnActualizar">Actualizar</button>
                        <button onclick="eliminarInsumo(${insumo.id})" class="btnEliminar">Eliminar</button>
                       
                    </td>

                </tr>`

        tbodyTabla.innerHTML = html;
        
        
    });

}

function eliminarInsumo(id) {

    Insumos.splice(insumo.id,1);

    GuardarInsumosLS(Insumos);

     mostrarTabla();
    
}

function actualizarInsumo(id) {

    Insumos = CargarInsumosLS();

   
    let insumoActualizar = Insumos.find(insumo=> insumo.id === id )

    console.log(insumoActualizar);

   

    if(insumoActualizar){
            // Cargar datos en el formulario
            formId.style.display = "none";
            formNombre.value = insumoActualizar.nombre;
            formDescrip.value = insumoActualizar.decripcion;
            formCateg.value = insumoActualizar.categoria;
            formUnd.value = insumoActualizar.und;
        
       
    }
  
    // Mostrar botón de actualizar
    btnUpdate.style.display = "block";
    btnUpdate.style.backgroundColor = "green";
    btnCancelar.style.display = "block";
    btnCancelar.style.backgroundColor = "red";

    btnCancelar.onclick = ()=>{
        btnUpdate.style.display = "none";
    
        btnCancelar.style.display = "none";
        formId.style.display = "block"; //mostrar de nuevo el id
       
        limpiarDatos();
    }
  
    // Evento para actualizar dentro del mismo ususiario
    btnUpdate.onclick = () => {
        
      // Actualizar datos en el objeto seleccionado
     
      insumoActualizar.nombre = formNombre.value;
      insumoActualizar.decripcion = formDescrip.value;
      insumoActualizar.categoria = formCateg.value;
      insumoActualizar.und = formUnd.value;
    
      // Guardar nuevamente en localStorage
      GuardarInsumosLS(Insumos);
  
      alert("✅ Usuario actualizado con éxito");
  
      // Limpiar formulario y tabla
      limpiarDatos();
      mostrarTabla();
  
      // Ocultar botón de actualizar
      btnUpdate.style.display = "none";
      btnCancelar.style.display = "none";
      formId.style.display = "block"; //mostrar de nuevo el id
    };
}


const btnBuscar= document.getElementById("btnBuscar");

btnBuscar.addEventListener('click', mostrarInput);

function mostrarInput(){

    let buscarId= parseInt(formId.value);
    
   
   

    console.log(Insumos)

    const Insumosfind = Insumos.find( insumo=> insumo.id === buscarId);
    console.log(Insumosfind)
    if(Insumosfind){
        alert('Este usuario esta registrado');

        formNombre.value = Insumosfind.nombre;
        formDescrip.value = Insumosfind.descripcion;
        formCateg.value = Insumosfind.categoria;
        formUnd.value = Insumosfind.und;
    }else{
        
        alert("insumo no esta registrado")
     
    }


    }