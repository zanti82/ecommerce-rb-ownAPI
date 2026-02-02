// ===================================================
// 1. REFERENCIAS A ELEMENTOS DEL DOM y VARIABLES GLOBALES
// ===================================================

const formularioCrud = document.getElementById('signupForm');
const tbodyTabla = document.getElementById("tbody"); 
const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");
const btnBuscar = document.getElementById("btnBuscar");
const btnEliminar = document.getElementById("btnEliminar");

// Referencias a los campos de input
const idInput = document.getElementById('id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const direccionInput = document.getElementById('direccion');
const telefonoInput = document.getElementById('telefono');
const rolInput = document.getElementById('rol');



// Variable global para almacenar el índice del usuario que estamos editando/eliminando.
let indiceAEditar = null; 

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

// ===================================================
// 2. INICIALIZACIÓN Y FUNCIONES BASE
// ===================================================

// **CORRECCIÓN 1: Eliminada la duplicidad en la inicialización.**
document.addEventListener('DOMContentLoaded', mostrarTabla);
document.addEventListener('DOMContentLoaded', limpiarFormulario); 
// La línea 'mostrarTabla();' al final de tu código anterior también fue eliminada.

// --- Funciones de Local Storage ---
function cargarDatosLS(){
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

function guardarDatosLS(datos){
    localStorage.setItem('usuarios', JSON.stringify(datos));
}

// --- Función Limpiar ---
function limpiarFormulario(){
    idInput.value = '';
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    direccionInput.value = '';
    telefonoInput.value = '';
    rolInput.value = '';
    
    // Configura los botones para el modo "Guardar" (Modo por defecto: Crear)
    btnGuardar.style.display = 'block';
    btnActualizar.style.display = 'none';
    btnEliminar.style.display = 'none';
    
    idInput.readOnly = false;
    indiceAEditar = null; 
}

// ===================================================
// 3. LEER (MOSTRAR TABLA)
// ===================================================

function mostrarTabla(){
    let Usuarios = cargarDatosLS();
    let html = "";
    
    Usuarios.forEach(function(usuario, index){
        html += `<tr>
                     <th scope="row">${index}</th>
                    <td>${usuario.cedula}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.password}</td>
                    <td>${usuario.direccion}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button onclick="cargarParaEditar('${usuario.cedula}', ${index})" class="btn btn-sm btn-info">Editar</button>
                    </td>
                </tr>`;
    });

    tbodyTabla.innerHTML = html; 
}

// ===================================================
// 4. CREAR (GUARDAR)
// ===================================================

formularioCrud.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (indiceAEditar !== null) {
        alert('Ya estás editando un usuario. Haz click en "Actualizar" o "Limpiar".');
        return;
    }

    const nuevoUsuario = {
        id: parseInt(idInput.value),
        nombre: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        direccion:direccionInput.value,
        telefono: telefonoInput.value,
        rol: rolInput.value
    };

    let Usuarios = cargarDatosLS();
    const validarId = Usuarios.find(u => u.ID === nuevoUsuario.id);

    if(validarId){
        alert('Error: El ID ya se encuentra registrado.');
    } else {
        Usuarios.push(nuevoUsuario);
        guardarDatosLS(Usuarios);
        alert('Usuario registrado con éxito.');
        limpiarFormulario();
        mostrarTabla();
    }
});

// ===================================================
// 5. BUSCAR, CARGAR Y ACTUALIZAR
// ===================================================

// Función compartida para cargar datos al formulario (Editar y Buscar)
window.cargarParaEditar = function(ID, index = null) {
    let Usuarios = cargarDatosLS();
    let usuarioEncontrado;
    
    if (index !== null) { // Viene del botón 'Editar' de la tabla
        usuarioEncontrado = Usuarios[index];
        indiceAEditar = index;
    } else { // Viene del botón 'Buscar' del formulario
        const indexEncontrado = Usuarios.findIndex(u => u.ID === ID);
        if (indexEncontrado === -1) {
            alert('Usuario no encontrado.');
            limpiarFormulario();
            return;
        }
        usuarioEncontrado = Usuarios[indexEncontrado];
        indiceAEditar = indexEncontrado;
    }
    
    // Llenar el formulario
    idInput.value = usuarioEncontrado.id;
    nameInput.value = usuarioEncontrado.nombre;
    emailInput.value = usuarioEncontrado.email;
    passwordInput.value = usuarioEncontrado.password;
    direccionInput.value = usuarioEncontrado.direccion;
    telefonoInput.value = usuarioEncontrado.telefono;
    rolInput.value = usuarioEncontrado.rol;

    // Configurar el modo Edición/Eliminar
    btnGuardar.style.display = 'none';
    btnActualizar.style.display = 'block';
    btnEliminar.style.display = 'block';
    idInput.readOnly = true; 
}

// --- Evento Buscar ---
btnBuscar.addEventListener('click', () => {
    const idBuscar = idInput.value;
    if (idBuscar) {
        cargarParaEditar(idBuscar);
    } else {
        alert('Por favor, ingresa un ID para buscar.');
    }
});

// --- Evento Actualizar ---
btnActualizar.addEventListener('click', () => {
    if (indiceAEditar === null) {
        alert('Error: No hay un usuario seleccionado para actualizar.');
        return;
    }

    let Usuarios = cargarDatosLS();

    // Actualizamos el objeto en la posición 'indiceAEditar'
    Usuarios[indiceAEditar] = {
        ID: idInput.value,
        nombre: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        direccion: direccionInput.value,
        telefono: telefonoInput.value,
        rol: rolInput.value
    };

    guardarDatosLS(Usuarios);
    alert(`Usuario con ID ${idInput.value} actualizado con éxito.`);
    
    limpiarFormulario();
    mostrarTabla();
});

// ===================================================
// 6. ELIMINAR (DELETE)
// ===================================================

btnEliminar.addEventListener('click', () => {
    if (indiceAEditar === null) {
        alert('Error: Primero debes buscar o cargar un usuario para eliminar.');
        return;
    }

    const idEliminar = idInput.value;

    if (!confirm(`¿Estás seguro de eliminar el usuario con ID ${idEliminar}?`)) {
        return;
    }

    let Usuarios = cargarDatosLS();

    Usuarios.splice(indiceAEditar, 1); 
    
    guardarDatosLS(Usuarios);
    alert(`Usuario con ID ${idEliminar} eliminado correctamente.`);
    
    limpiarFormulario();
    mostrarTabla();
});

