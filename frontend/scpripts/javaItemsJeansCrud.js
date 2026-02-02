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

// --- Funciones para jeans---

const formReferencias = document.getElementById('form_Jeans');
const refIdInput = document.getElementById('ID');
const refEstiloInput = document.getElementById('estilo');
const refColorInput = document.getElementById('color');
const refTallaInput = document.getElementById('talla');
const refStockInput = document.getElementById('stock');
const refPreciolInput = document.getElementById('precio');
const refImagenUrl= document.getElementById('imagen');


let listaRef = document.getElementById('lista_Ref');

// LEER
async function cargarRef() {
    const response = await fetch(`${API_BASE_URL}/referencias`);
    const Ref = await response.json();
    console.log(Ref);
    
   listaRef.innerHTML = '';
    Ref.forEach(rf => {
        let item = document.createElement('div');
        item.innerHTML = `
            <span><strong>ID: ${rf.idRef} <br></strong> 
                          Estilo:  (${rf.estilo}) <br>
                          Color:  (${rf.color}) <br>
                          Talla:  (${rf.talla}) <br>
                          Stock:  (${rf.stock}) <br>
                          Imagen:  (${rf.imagenURL}) <br>
                          precio: (${rf.price})<br></span>
            <div>
                <button onclick="editarRef(${rf.idRef}, '${rf.estilo}', '${rf.color}','${rf.talla}',
                '${rf.stock}', '${rf.imagenURL}','${rf.price}')">Editar</button>
                <button onclick="eliminarRef(${rf.idRef})">Eliminar</button>
            </div>
        `;
        listaRef.appendChild(item);
    });
}


// Preparar para ACTUALIZAR
function editarRef(idRef, estilo, color, talla, stock, imagenURL, price) {
    refIdInput.value = idRef;
    refEstiloInput.value = estilo;
    refColorInput.value = color;
    refTallaInput.value = talla;
    refStockInput.value = stock;
    refPreciolInput.value = price;
    refImagenUrl.value = imagenURL;
}

// BORRAR
async function eliminarRef(idRef) {
    if (!confirm('¿Estás seguro que desea eliminar esta Referencia?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/referencias/${idRef}`, { method: 'DELETE' });

        if(response.ok){
            alertTosty("Referencia eliminada correctamente", "error");
            cargarRef();
        }else {
            alertTosty("No se pudo eliminar la referencia", "info");
        }
        
    } catch (error) {
        console.error("Error al borrar:", error);
        alertTosty("Error de conexión con el servidor", "info");
        
    }
    
}


// CREAR y ACTUALIZAR
async function existeReferencia(id) {
    const response = await fetch(`${API_BASE_URL}/referencias/${id}`);
    return response.ok; // true si existe, false si no
}



formReferencias.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = refIdInput.value;
    let url = `${API_BASE_URL}/referencias`;
    let method = 'POST';

    const refData = {
        
        estilo: refEstiloInput.value,
        color: refColorInput.value,
        talla: refTallaInput.value,
        stock: refStockInput.value,
        imagenURL: refImagenUrl.value, 
        price: refPreciolInput.value,
              
    };

    if (id) {
        const existe = await existeReferencia(id);

        alert(`si o no: ${existe}`);

        if (existe) {
            method = 'PUT';
            url = `${API_BASE_URL}/referencias/${id}`;
            refData.idRef = id;
        } else {
            alertTosty('El ID no existe, se creará una nueva referencia', 'info');
            refData.idRef = id; // si tu backend acepta ID manual
        }
       
   }

   
   alert(`metodo: ${method}`);

    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json', },
            body: JSON.stringify(refData)
           
        });

        if (!response.ok) {
            // Si el servidor devuelve un error, lo mostramos
            const errorData = await response.json();
            alertTosty(`Error: ${errorData.mensaje || 'Fallo en el servidor'}`, 'error');
            return;
            
        } 
        const mensajeExito = id ? `Referencia ${refData.estilo} actualizado` : `Referencia ${refData.estilo} creada con éxito`;

        alertTosty(mensajeExito, 'ok');

        limpiarFormulario('form_Jeans');
        await cargarRef();

    } catch (error) {
        console.error('Error de red:', error);
        alertTosty('No se pudo conectar con el servidor', 'error');
    }
});

function limpiarFormulario(formId) {
    document.getElementById(formId).reset();
    document.getElementById('ID').value = '';
}


// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    cargarRef();
   
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