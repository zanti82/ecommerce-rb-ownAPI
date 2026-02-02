//=============================================================================
// CARRITO DE COMPRAS - VERSIÓN CON BACKEND
//=============================================================================

const API_BASE_URL = 'http://localhost:8081/api';

// Variables globales
let usuario = null;
let carritoCompra = []; // Array temporal para mostrar en pantalla
let sumTotal = 0;

// Referencias al DOM
const contadorCarrito = document.getElementById("verCarrito");
const itemsCarrito = document.getElementById('itemsCarrito');
const totalCarrito = document.getElementById('carritoTotalFinal');
const btnVaciarCarrito = document.getElementById('btnVaciarCompra');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
const btnSeguirComprando = document.getElementById('btnSeguirComprando');
const User = document.getElementById("usuarioActivo");

//=============================================================================
// FUNCIÓN TOASTIFY (mantenemos la tuya)
//=============================================================================

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
        onClick: function(){} 
    }).showToast();
}

//=============================================================================
// VERIFICAR SESIÓN Y CARGAR CARRITO AL INICIAR
//=============================================================================
window.addEventListener('DOMContentLoaded', async () => {
    // Obtener usuario activo de localStorage
    const usuarioStr = localStorage.getItem('usuarioActivo');
    
    if (!usuarioStr) {
        alert('⚠️ Debes iniciar sesión para ver tu carrito');
        window.location.href = 'htmlLogin.html';
        return;
    }
    
    usuario = JSON.parse(usuarioStr);
    
    // Mostrar info del usuario
    if (User) {
        User.style.display = "block";
        User.textContent = `Hola ${usuario.nombre} - LOG OUT`;
    }
    
    // Cargar carrito desde el servidor
    await cargarCarritoDesdeServidor();
});

//=============================================================================
// CARGAR CARRITO DESDE EL SERVIDOR (REEMPLAZA CargarDatosCarritoLS)
//=============================================================================
async function cargarCarritoDesdeServidor() {
    if (!usuario || !usuario.id) {
        console.error('No hay usuario logueado');
        return;
    }
    
    try {
        console.log(`📡 Cargando carrito del usuario ${usuario.id}...`);
        
        const response = await fetch(`${API_BASE_URL}/carrito/${usuario.id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar carrito');
        }
        
        carritoCompra = await response.json();
        
        console.log('✅ Carrito cargado:', carritoCompra);
        
        // Actualizar interfaz
        crearTablaCarrito();
        actualizarContadorCarrito();
        
    } catch (error) {
        console.error('❌ Error cargando carrito:', error);
        alertTosty('Error al cargar el carrito', 'error');
        
        // Si hay error, mostrar carrito vacío
        carritoCompra = [];
        crearTablaCarrito();
        actualizarContadorCarrito();
    }
}


//=============================================================================
// ACTUALIZAR CONTADOR DEL CARRITO
//=============================================================================
function actualizarContadorCarrito() {
    if (!contadorCarrito) return;
    
    // Sumar cantidades de todos los items la funcina comeinza con sum= 0
    const totalItems = carritoCompra.reduce((sum, item) => sum + item.cantidad, 0);
    
    contadorCarrito.textContent = `🛒 Carrito (${totalItems})`;
}


//=============================================================================
// CREAR TABLA DEL CARRITO (VERSIÓN MEJORADA)
//=============================================================================
function crearTablaCarrito() {
    if (!itemsCarrito) return;
    
    // Limpiar contenido anterior
    itemsCarrito.innerHTML = "";
    sumTotal = 0;

    if (carritoCompra.length === 0) {
        itemsCarrito.innerHTML = `
            <p style="text-align:center; padding: 40px; color: #999;">
                Tu carrito está vacío 😔
                <br><br>
                <a href="hombre.html" style="color: #3498db;">Ver productos</a>
            </p>
        `;
        
        if (totalCarrito) {
            totalCarrito.textContent = '$0';
        }
        
        return;
    }

    // Crear items del carrito
    carritoCompra.forEach((item) => {
        // Crear elemento del item
        let itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        itemDiv.setAttribute('data-id-carrito', item.idCarrito);

        // Estilo del producto
        let estilo = document.createElement('span');
        estilo.className = 'item-estilo';
        estilo.innerHTML = `
            <strong>${item.estilo}</strong><br>
            <small>Color: ${item.color} | Talla: ${item.talla}</small><br>
            <small>Cantidad: ${item.cantidad} x $${formatearPrecio(item.precio)}</small>
        `;

        // Total del item
        let total = document.createElement('span');
        total.className = 'item-total';
        total.textContent = `$${formatearPrecio(item.subtotal)}`;

        // Botón eliminar
        let eliminar = document.createElement('button');
        eliminar.className = 'btn-eliminar';
        eliminar.textContent = '🗑️ Eliminar';
        eliminar.onclick = () => eliminarItemDelCarrito(item.idCarrito);

        // Anexar todo
        itemDiv.appendChild(estilo);
        itemDiv.appendChild(total);
        itemDiv.appendChild(eliminar);
        itemsCarrito.appendChild(itemDiv);

        // Sumar al total
        sumTotal += item.subtotal;
    });

    // Actualizar total
    if (totalCarrito) {
        totalCarrito.textContent = `$${formatearPrecio(sumTotal)}`;
    }
}

//=============================================================================
// ELIMINAR ITEM DEL CARRITO (VERSIÓN CON BACKEND)
//=============================================================================
async function eliminarItemDelCarrito(idCarrito) {
    if (!confirm('¿Eliminar este producto del carrito?')) {
        return;
    }
    
    try {
        console.log(`🗑️ Eliminando item ${idCarrito}...`);
        
        const response = await fetch(`${API_BASE_URL}/carrito/${idCarrito}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al eliminar item');
        }
        
        const data = await response.json();
        console.log('✅ Item eliminado:', data);
        
        alertTosty('Producto eliminado del carrito', 'ok');
        
        // Recargar carrito actualizado desde el servidor
        await cargarCarritoDesdeServidor();
        
    } catch (error) {
        console.error('❌ Error eliminando item:', error);
        alertTosty('Error al eliminar producto', 'error');
    }
}
//=============================================================================
// VACIAR CARRITO (VERSIÓN CON BACKEND)
//=============================================================================
async function vaciarCarrito() {
    if (carritoCompra.length === 0) {
        alertTosty('El carrito ya está vacío', 'info');
        return;
    }
    
    if (!confirm('¿Vaciar todo el carrito?')) {
        return;
    }
    
    try {
        console.log(`🗑️ Vaciando carrito del usuario ${usuario.id}...`);
        
        const response = await fetch(`${API_BASE_URL}/carrito/vaciar/${usuario.id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Error al vaciar carrito');
        }
        
        const data = await response.json();
        console.log('✅ Carrito vaciado:', data);
        
        alertTosty('Carrito vaciado exitosamente', 'ok');
        
        // Recargar carrito (ahora vacío)
        await cargarCarritoDesdeServidor();
        
    } catch (error) {
        console.error('❌ Error vaciando carrito:', error);
        alertTosty('Error al vaciar carrito', 'error');
    }
}

//=============================================================================
// FINALIZAR COMPRA (PLACEHOLDER - IMPLEMENTAREMOS EN PARTE A)
//=============================================================================
async function finalizarCompra() {
    if (carritoCompra.length === 0) {
        alertTosty('¡El carrito está vacío!', 'error');
        return;
    }
    
    if (!usuario) {
        alertTosty('Debes iniciar sesión', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    if (!confirm('¿Confirmar compra?')) {
        return;
    }
    
    // 🚧 PRÓXIMA LECCIÓN: Aquí crearemos la venta en el backend
    alertTosty('Proceso de compra próximamente (Parte A)', 'info');
    
    // Mostrar resumen temporal
    Swal.fire({
        title: '🚧 En Construcción',
        html: `
            <p>El proceso de finalización de compra se implementará en la <strong>Parte A</strong>.</p>
            <p>Por ahora, tu carrito contiene:</p>
            <ul style="text-align: left;">
                ${carritoCompra.map(item => 
                    `<li>${item.estilo} (x${item.cantidad}) - $${formatearPrecio(item.subtotal)}</li>`
                ).join('')}
            </ul>
            <hr>
            <h3>Total: $${formatearPrecio(sumTotal)}</h3>
        `,
        icon: 'info',
        confirmButtonText: 'Entendido'
    });
}

//=============================================================================
// UTILIDADES
//=============================================================================
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO').format(precio);
}

//=============================================================================
// EVENT LISTENERS
//=============================================================================

// Botón vaciar carrito
if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
}

// Botón finalizar compra
if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener('click', finalizarCompra);
}

// Botón seguir comprando
if (btnSeguirComprando) {
    btnSeguirComprando.addEventListener('click', () => {
        window.location.href = 'hombre.html';
    });
}

// Botón logout
if (User) {
    User.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) {
            localStorage.removeItem('usuarioActivo');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRol');
            alert('Has salido exitosamente');
            window.location.href = 'login.html';
        }
    });
}