//___________________________________________________//
//**************CRUD PARA ITEMS*********************//
//___________________________________________________//


//CAPTURAMOS LOS ITEMS DEL HTML

const formularioCrud = document.getElementById('signupForm');
const tbodyTabla = document.getElementById("tbody1"); 
const formId =  document.getElementById('id');
const formNombre =  document.getElementById('name');
const formEmail = document.getElementById('email');
const formPassword = document.getElementById('password');
const formDireccion = document.getElementById('direccion');
const formTelefono = document.getElementById('telefono');
const fromRol = document.getElementById('rol');

const btnUpdate = document.getElementById("btnActualizar"); //boton oculto
const btnCancelar = document.getElementById("btnCancelar"); //boton oculto

//CARGAMOS LA PAGINA CON LA TABLA Y LIMPIAR INPUTS

document.addEventListener('DOMContentLoaded', mostrarTabla);
document.addEventListener('DOMContentLoaded', limpiarDatos); 


//CONSTRUCCION DE UN OBJETO

class usuario{
    constructor(cedula, nombre, email, password, direccion,telefono){
        this.cedula=cedula;
        this.nombre=nombre;
        this.email = email;
        this.password = password;
        this.direccion = direccion;
        this. telefono =  telefono;
        this. rol = "cliente"
    }
}

//********** funciones para amnejo del local storge */
function CargarDatosLS(){
    return JSON.parse(localStorage.getItem('usuarios')) || [];
  
}

function guaradarDatosLS(datos){
    localStorage.setItem('usuarios',JSON.stringify(datos));
}


//array para Usuarios, para ensayis luego tomamos el localstoge

let Usuarios=CargarDatosLS();


console.log(Usuarios)


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
//funcion para crear nuevo usuario
//******************************* */

formularioCrud.addEventListener('submit', (e) =>{
    e.preventDefault();

    const idN = parseInt(formId.value);
    const nombreN =  formNombre.value;
    const emailN = formEmail.value;
    const passwordN = formPassword.value;
    const direccionN = formDireccion.value;
    const telefonoN = formTelefono.value;
    const rolN = fromRol.value;

    // vamos a crear un objeto para almacenar los usuarios que se registren 

    Usuarios=CargarDatosLS();
    console.log(Usuarios)


    const validarId = Usuarios.find(usuario => usuario.id === id);

    if(validarId){
        alert('Este usuario ya se encuentra registrado');
    }else{

        let newuser= new usuario (idN, nombreN, emailN, passwordN, direccionN, telefonoN)
        Usuarios.push(newuser);
       //
       //  guaradarDatosLS(Usuarios);
        alert('Usuario registrado con exito');
     
    }
    limpiarDatos()
    mostrarTabla()
    

    });



// ***limpiar datos de inputs
function limpiarDatos(){
    
    formId.value = "";
    formNombre.value = "";
    formEmail.value = "";
    formPassword.value = "";
    formDireccion.value = "";
    formTelefono.value  = "";
    fromRol.value = "";

}

function mostrarTabla(){
   // let Usuarios= CargarDatosLS();
    
   let html=""; //variable html para sumar las filas

    //crear filas de la tabla por medio del html
 
    
    Usuarios.forEach(function(usuario,index){

        html+= `<tr>
                    <th scope="row">${index}</th>
                    <td>${usuario.cedula}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.password}</td>
                    <td>${usuario.direccion}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button onclick="actualizarUsuario(${usuario.cedula})" class="btnActualizar">Actualizar</button>
                        <button onclick="eliminarUsuario(${usuario.cedula})" class="btnEliminar">Eliminar</button>
                       
                    </td>

                </tr>`

        tbodyTabla.innerHTML = html;
        
        
    });

}

function eliminarUsuario(id) {

    Usuarios.splice(usuario.id,1);

    //guaradarDatosLS(Usuarios);

     mostrarTabla();
    
}

function actualizarUsuario(id) {

    Usuarios = CargarDatosLS();
    
    console.log(id)
    let usuarioActualizar = Usuarios.find(user=> user.cedula === String(id) )

    console.log(usuarioActualizar)

   

    if(usuarioActualizar){
            // Cargar datos en el formulario
            formId.style.display = "none";
            formNombre.value = usuarioActualizar.nombre;
            formEmail.value = usuarioActualizar.email;
            formPassword.value = usuarioActualizar.password;
            formDireccion.value = usuarioActualizar.direccion;
            formTelefono.value  = usuarioActualizar.telefono;
            fromRol.value = usuarioActualizar.rol; 
       
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
     
      usuarioActualizar.nombre = formNombre.value;
      usuarioActualizar.email = formEmail.value;
      usuarioActualizar.password = formPassword.value;
      usuarioActualizar.direccion = formDireccion.value;
      usuarioActualizar.telefono = formTelefono.value;
      usuarioActualizar.rol = fromRol.value;
  
      // Guardar nuevamente en localStorage
       // guaradarDatosLS(Usuarios);
  
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
    
    //let Usuarios=CargarDatosLS();
   

    console.log(Usuarios)

    const Usuariofind = Usuarios.find( usuario=> usuario.cedula === buscarId);
    console.log(Usuariofind)
    if(Usuariofind){
        alert('Este usuario esta registrado');

        formNombre.value = Usuariofind.nombre;
        formEmail.value = Usuariofind.email;
        formPassword.value = Usuariofind.password;
        formDireccion.value = Usuariofind.direccion;
        formTelefono.value  = Usuariofind.telefono;
        fromRol.value = Usuariofind.rol; 
       
    }else{
        
        alert("usuario no esta registrado")
     
    }


    }