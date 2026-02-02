// ===================================================
// 1. REFERENCIAS A ELEMENTOS DEL DOM
// ===================================================

const formularioCarrito = document.getElementById('signupForm');
const tbodyTabla = document.getElementById("tbodyVentas"); 
const btnGuardar = document.getElementById("btnGuardar");
const btnBuscar = document.getElementById("btnBuscar");

// Referencias a los campos de input
const skuInput = document.getElementById('SKU');
const clienteInput = document.getElementById('cliente');
const nitInput = document.getElementById('cedula');
const totalInput = document.getElementById('total');




// ===================================================
// 2. INICIALIZACIÓN Y FUNCIONES BASE
// ===================================================

// Carga la lista de productos al iniciar la página
document.addEventListener('DOMContentLoaded', mostrarTabla);
document.addEventListener('DOMContentLoaded', limpiarFormulario); 

// --- Funciones de Local Storage ---
function cargarFacturasLS(){
    // Carga el array de items del carrito, o un array vacío si no hay datos.
    return JSON.parse(localStorage.getItem('facturas')) || [];
}

function guardarFacturasLS(datos){
    // Almacena el array de datos en localStorage
    localStorage.setItem('facturas', JSON.stringify(datos));
}

function limpiarFormulario(){
    // Limpia solo los campos del formulario de entrada
    skuInput.value = '';
    clienteInput.value = '';
    nitInput.value = '';
    totalInput.value = '';
    
    skuInput.readOnly = false; // Asegura que el SKU se pueda editar para añadir nuevos items
}

// ===================================================
// 3. LEER (MOSTRAR TABLA DE ITEMS)
// ===================================================

function mostrarTabla(){
    let fact = cargarFacturasLS();
    let html = "";

       
    
    fact.forEach(function(item, index){
        html += `<tr>
                    <td>${item.numFactura}</td>
                    <td>${item.comprador}</td>
                    <td>${item.nitComprador}</td>
                    <td>$${parseFloat(item.total).toFixed(2)}</td>
                    <td>
                        <button onclick="AnularFact(${index})" class="anular">ANULAR</button>
                    </td>
                </tr>`;
    });

    tbodyTabla.innerHTML = html; 
}


// ===================================================
// 4. CREAR (GUARDAR ITEM AL CARRITO)
// ===================================================

formularioCarrito.addEventListener('submit', (e) => {
    e.preventDefault();

    let nf= parseInt(skuInput.value);
    
    const nuevoItem = {
        numFactura: skuInput.value,
        comprador: clienteInput.value,
        nitComprador: nitInput.value,
        total: totalInput.value
    };

    let fact = cargarFacturasLS();

    // Verificamos si el SKU ya existe
    const factExistente = fact.find(f => f.numFactura === nf);

    if(factExistente){
        alert("la factura ya existe y se mando a la dian. SOlo se puede anular")
    } else {
        // Si no existe, lo añadimos como nuevo
        fact.push(nuevoItem);
        alert('Factura añadida al carrito.');
    }

    guardarFacturasLS(fact);
    limpiarFormulario();
    mostrarTabla();
});


// ===================================================
// 5. BUSCAR (Llenar formulario para ver/editar)
// ===================================================

btnBuscar.addEventListener('click', () => {


    const skuBuscar = parseInt(skuInput.value);

    console.log(skuBuscar)

    if (!skuBuscar) {
        alert('Por favor, ingresa el CÓDIGO (SKU) para buscar.');
        return;
    }

    let fact = cargarFacturasLS();
    
    const itemEncontrado = fact.find(f => f.numFactura === skuBuscar);

    if (itemEncontrado) {
        // Llenar el formulario con los datos encontrados
        clienteInput.value = itemEncontrado.comprador;
        nitInput.value = itemEncontrado.nitComprador;
        totalInput.value = itemEncontrado.total;
        skuInput.readOnly = true; // No permitir que el usuario cambie el SKU mientras está cargado

     
        alert(`Producto "${itemEncontrado.numFactura}" cargado. Puedes anularlo.`);
    } else {
        alert('factura no encontrado en el carrito. Puedes añadirlo ahora.');
        limpiarFormulario();
        skuInput.value = skuBuscar; // Dejamos el SKU ya escrito
    }
});


// ===================================================
// 6. ELIMINAR (DELETE - Opción Básica)
// ===================================================

function AnularFact(numFactura) {

    let fact = cargarFacturasLS();
    console.log(fact)

    const itemEncontrado = fact.find(f => f.numFactura === numFactura);

    fact.splice(itemEncontrado,1);

   guardarFacturasLS(fact);

     mostrarTabla();
    
}