const API_BASE_URL = 'http://localhost:8081/api';


//-- tostyfy

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

// --- Funciones para Usuarios ---

const formCliente = document.getElementById('form-cliente');
const clienteIdInput = document.getElementById('cliente-id');
const clienteDocInput = document.getElementById('cliente-documento');
const clienteNombreInput = document.getElementById('cliente-nombre');
const clienteEmailInput = document.getElementById('cliente-email');
const clientePassInput = document.getElementById('cliente-pass');
const clienteDirInput = document.getElementById('cliente-dir');
const clienteTelInput = document.getElementById('cliente-tel');
const clienteRolInput = document.getElementById('cliente-rol');


let listaClientes = document.getElementById('lista-cliente');

// LEER

async function cargarClientes() {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    const clientes = await response.json();
    console.log(clientes);
    
    listaClientes.innerHTML = ''; // Limpiar lista
    clientes.forEach(cl => {
        let item = document.createElement('div');
        item.innerHTML = `
            <span><strong>id: (${cl.id})<br></span>
                          DocId: (${cl.documento})<br></span>
                          Nombre: ${cl.name} <br></strong> 
                          correo:  (${cl.mail}) <br>
                          
            <div>
                <button onclick="editarCliente(${cl.id}, '${cl.documento}', '${cl.name}', '${cl.mail}',
                '${cl.password}', '${cl.phoneNumber}','${cl.address}', '${cl.role}')">Editar</button> 
                <button onclick="eliminarCliente(${cl.id})">Eliminar</button>
            </div>
        `;
        listaClientes.appendChild(item);
               
    });
}

// Preparar para ACTUALIZAR
function editarCliente(id, documento, name, mail, password, phonNumber, address, role) {
    clienteIdInput.value = id;
    clienteDocInput.value = documento;
    clienteNombreInput.value = name;
    clienteEmailInput.value = mail;
    clientePassInput.value = password;
    clienteTelInput.value = phonNumber;
    clienteDirInput.value = address;
    clienteRolInput.value = role;
   
}

// BORRAR
async function eliminarCliente(id) {
    if (!confirm('¿Estás seguro que desea eliminar este Usuario?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, { method: 'DELETE' });

        if(response.ok){
            alertTosty("Usuario eliminado correctamente", "error");
            cargarClientes();
        }else {
            alertTosty("No se pudo eliminar el usuario", "info");
        }
        
    } catch (error) {
        console.error("Error al borrar:", error);
        alertTosty("Error de conexión con el servidor", "info");
        
    }
    
}

// CREAR y ACTUALIZAR



formCliente.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id= clienteIdInput.value;
    let url = `${API_BASE_URL}/usuarios`; //url para pasarla al fetch con el method
    let method = 'POST';

    const clienteData = {
        
        documento : clienteDocInput.value,
        name: clienteNombreInput.value,
        mail: clienteEmailInput.value,
        password : clientePassInput.value,
        phoneNumber : clienteTelInput.value,
        address : clienteDirInput.value,
        role : clienteRolInput.value,
    }
    
    if (id) {
        method = 'PUT';
        url = `${API_BASE_URL}/usuarios/${id}`; // faltaba id para hacer el put update
        clienteData.id = id;
                              
        }
    if (!clienteData.mail.includes('@') || !clienteData.mail.includes('.')) {
        alert("Por favor, ingresa un email válido.");
        return;
    }

    
    try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(clienteData)
            
            });

                  
            if (!response.ok) {
                // Si el servidor devuelve un error, lo mostramos
                const errorData = await response.json();
                alertTosty(`Error: ${errorData.mensaje || 'Fallo en el servidor'}`, 'error');
                return;
                
            } 
            const mensajeExito = id ? `Usuario ${clienteData.name} actualizado` : `Usuario ${clienteData.name} creado con éxito`;

            alertTosty(mensajeExito, 'ok');

            limpiarFormulario('form-cliente');
            await cargarClientes();

        } catch (error) {
            console.error('Error de red:', error);
            alertTosty('No se pudo conectar con el servidor', 'error');
        }
});

function limpiarFormulario(formId) {
    document.getElementById(formId).reset();
    document.getElementById(`${formId.split('-')[1]}-id`).value = '';
}


// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
    // Aquí llamarías a cargarCategorias() y cargarArticulos()
});


//********************************PARA LOGOUT Y USUARIO */

const User = document.querySelector(".logout-link"); //ususario

let usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioActivo) {
        User.style.display= "block";
        User.textContent = `hola ${usuarioActivo.nombre} -  LOG OUT`
        console.log("usuario activo")
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