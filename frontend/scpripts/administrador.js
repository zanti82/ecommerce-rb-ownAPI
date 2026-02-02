// =========================================================
// 1. ESTRUCTURA INICIAL Y CARGA DE DATOS
// =========================================================

// Datos de productos iniciales o cargados desde localStorage
let products = JSON.parse(localStorage.getItem('adminProducts')) || [
    // Datos de ejemplo para el primer uso
    { id: 1, name: 'Skin 504', ref: 'CC-001', color: 'Blanco', sizes: 'S, M, L, XL' },
    { id: 2, name: 'Pantalón Jean', ref: 'PJ-005', color: 'Azul Oscuro', sizes: '30, 32, 34, 36' },
    { id: 3, name: 'Jeans de Cuero', ref: 'CHQ-002', color: 'Negro', sizes: 'M, L, XL' },
    { id: 4, name: 'Jeans descaderado', ref: 'VF-010', color: 'Estampado', sizes: 'S, M' },
    { id: 5, name: 'Skini blue sky', ref: 'ZU-021', color: 'Gris', sizes: '39, 40, 41, 42' }
];

// Contador para IDs (se asegura de que los nuevos IDs sean únicos)
let nextProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

// Referencias a elementos del DOM
const productGrid = document.querySelector('.product-grid');
const productForm = document.querySelector('.product-form');
const prodNameInput = document.getElementById('prod-name');
const prodRefInput = document.getElementById('prod-ref');
const prodSizesInput = document.getElementById('prod-sizes');
const formSubmitButton = productForm.querySelector('button[type="submit"]');

// Variable para saber si estamos en modo Edición (guardará el ID del producto a editar)
let editingProductId = null;

/**
 * Guarda el array de productos en el localStorage.
 */
function saveProducts(updatedProducts) {
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    products = updatedProducts; // Actualiza la variable global
}

// =========================================================
// 2. FUNCIÓN READ (LEER Y RENDERIZAR)
// =========================================================

/**
 * Dibuja todos los productos en la cuadrícula (grid).
 */
function renderProducts(productList = products) {
    // Elimina todas las filas de productos (solo las generadas, no los headers)
    const existingItems = productGrid.querySelectorAll('.grid-item-row');
    existingItems.forEach(item => item.remove());

    productList.forEach(product => {
        const row = document.createElement('div');
        row.className = 'grid-item-row';
        row.dataset.productId = product.id; 

        row.innerHTML = `
            <div class="grid-item">${product.name}</div>
            <div class="grid-item">${product.ref}</div>
            <div class="grid-item">${product.color || 'N/A'}</div>
            <div class="grid-item">${product.sizes}</div>
            <div class="grid-item actions">
                <button class="btn-edit" data-id="${product.id}" title="Editar"><i class="fa fa-edit"></i></button>
                <button class="btn-delete" data-id="${product.id}" title="Eliminar"><i class="fa fa-trash"></i></button>
            </div>
        `;
        productGrid.appendChild(row);
    });

    // Añadir los listeners de eventos después de renderizar
    addGridEventListeners();
}

/**
 * Asigna los listeners a los botones de Editar y Eliminar de la cuadrícula.
 */
function addGridEventListeners() {
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            editProduct(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            deleteProduct(id);
        });
    });
}
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

// =========================================================
// 3. FUNCIÓN CREATE / UPDATE (CREAR / ACTUALIZAR)
// =========================================================

/**
 * Maneja el envío del formulario para crear o actualizar un producto.
 */
function handleFormSubmit(e) {
    e.preventDefault();

    const name = prodNameInput.value.trim();
    const ref = prodRefInput.value.trim();
    const sizes = prodSizesInput.value.trim();
    const color = 'N/A'; // Asumiendo que el color no es gestionado por este formulario

    if (!name || !ref || !sizes) {
        alert('Por favor, rellena al menos el Nombre, Referencia y Tallas.');
        return;
    }

    if (editingProductId !== null) {
        // Modo ACTUALIZAR (UPDATE)
        updateProduct(editingProductId, name, ref, color, sizes);
    } else {
        // Modo CREAR (CREATE)
        createProduct(name, ref, color, sizes);
    }

    // Limpiar y resetear el formulario después de la operación
    resetForm();
}

/**
 * Crea un nuevo producto y lo añade a la lista.
 */
function createProduct(name, ref, color, sizes) {
    const newProduct = {
        id: nextProductId++,
        name,
        ref,
        color,
        sizes
    };

    const newProducts = [...products, newProduct];
    saveProducts(newProducts);
    renderProducts();
}

/**
 * Rellena el formulario con los datos del producto a editar.
 */
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // 1. Rellenar el formulario
    prodNameInput.value = product.name;
    prodRefInput.value = product.ref;
    prodSizesInput.value = product.sizes;
    
    // 2. Cambiar el estado del formulario a Edición
    editingProductId = id;
    formSubmitButton.textContent = 'Guardar Cambios (Actualizar)';
    formSubmitButton.classList.remove('btn-create');
    formSubmitButton.classList.add('btn-update-active');
    
    document.querySelector('.management-section h2').textContent = 'Gestionar Producto (Editando ID: ' + id + ')';

    // Desplazarse al formulario
    productForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Actualiza los datos de un producto existente.
 */
function updateProduct(id, newName, newRef, newColor, newSizes) {
    const updatedProducts = products.map(p => 
        p.id === id ? { 
            ...p, 
            name: newName, 
            ref: newRef, 
            // Mantiene el color si ya tenía uno, si no, usa el valor por defecto ('N/A')
            color: p.color && p.color !== 'N/A' ? p.color : newColor, 
            sizes: newSizes 
        } : p
    );

    saveProducts(updatedProducts);
    renderProducts();
}

/**
 * Resetea el formulario a su estado inicial de Creación.
 */
function resetForm() {
    productForm.reset();
    editingProductId = null;
    formSubmitButton.textContent = 'Crear Nuevo Producto';
    formSubmitButton.classList.remove('btn-update-active');
    formSubmitButton.classList.add('btn-create'); 
    document.querySelector('.management-section h2').textContent = 'Gestionar Producto';
}


// =========================================================
// 4. FUNCIÓN DELETE (BORRAR)
// =========================================================

/**
 * Elimina un producto de la lista.
 */
function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? (ID: ' + id + ')')) {
        const updatedProducts = products.filter(p => p.id !== id);
        
        saveProducts(updatedProducts);
        renderProducts();
        
        if (editingProductId === id) {
            resetForm();
        }
    }
}


// =========================================================
// 5. INICIALIZACIÓN Y BÚSQUEDA
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderiza los productos iniciales/guardados
    renderProducts();
    
    // 2. Asigna el manejador de eventos al formulario de gestión
    productForm.addEventListener('submit', handleFormSubmit);

    // 3. Inicializa el formulario en modo "Crear"
    resetForm(); 

    // 4. Integración de la búsqueda del header (READ con filtro)
    const searchInput = document.querySelector('.search-form input[type="text"]');
    const searchForm = document.querySelector('.search-form');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            renderProducts(products);
            return;
        }

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.ref.toLowerCase().includes(searchTerm) ||
            product.sizes.toLowerCase().includes(searchTerm)
        );
        
        renderProducts(filteredProducts);
    });
});