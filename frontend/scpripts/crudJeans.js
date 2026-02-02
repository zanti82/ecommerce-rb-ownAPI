// Recuperar datos guardados o inicializar
let proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];

// Guardar en LocalStorage
function guardarEnLocalStorage() {
  localStorage.setItem("proveedores", JSON.stringify(proveedores));
}

// Función para confirmar salida 
function confirmarSalida(event) {
  event.preventDefault(); // evita que el enlace se ejecute de inmediato
  const salir = confirm("¿Estás seguro que deseas salir?");
  if (salir) {
    window.location.href = "login,html";
  } else {
    
  }
}


// Crear nuevo jean (proveedor )
function crearProveedor() {
  const nombre = document.getElementById("nombre").value.trim();
  const ref = document.getElementById("ref").value.trim();
  const tallas = document.getElementById("tallas").value.trim();
  const cantidad = document.getElementById("cantidad").value.trim();
  const imagenInput = document.getElementById("imagen");

  if (!nombre || !ref) {
    alert("Por favor ingresa al menos el nombre y la referencia del jean");
    return;
  }

  // Si hay imagen, convertirla 
  if (imagenInput.files && imagenInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      agregarProveedor(nombre, ref, tallas, cantidad, e.target.result);
    };
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    // Si no hay imagen
    agregarProveedor(nombre, ref, tallas, cantidad, "");
  }
}

// Agregar el nuevo jean a la lista
function agregarProveedor(nombre, ref, tallas, cantidad, imagen) {
  const proveedor = { nombre, ref, tallas, cantidad, imagen };
  proveedores.push(proveedor);
  guardarEnLocalStorage();
  mostrarProveedores();
  limpiarCampos();
}

// Mostrar todos los jeans
function mostrarProveedores(lista = proveedores) {
  const tabla = document.getElementById("listaProveedores");
  tabla.innerHTML = "";

  lista.forEach((prov, index) => {
    const fila = `
      <tr>
        <td><img src="${prov.imagen || 'https://via.placeholder.com/60'}" alt="imagen" width="60" height="60" style="object-fit:cover; border-radius:8px;"></td>
        <td>${prov.nombre}</td>
        <td>${prov.ref}</td>
        <td>${prov.tallas}</td>
        <td>${prov.cantidad}</td>
        <td>
          <button style="background:#28a745; color:white;" onclick="editarProveedor(${index})">Editar</button>
          <button style="background:#dc3545; color:white;" onclick="eliminarProveedor(${index})">Eliminar</button>
        </td>
      </tr>
    `;
    tabla.innerHTML += fila;
  });
}

// Buscar por nombre o referencia
function buscarProveedor() {
  const texto = prompt("Buscar jean por nombre o referencia:");
  if (!texto) return;
  const resultado = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(texto.toLowerCase()) ||
    p.ref.toLowerCase().includes(texto.toLowerCase())
  );
  mostrarProveedores(resultado);
}

// Editar registro
function editarProveedor(index) {
  const prov = proveedores[index];
  document.getElementById("nombre").value = prov.nombre;
  document.getElementById("ref").value = prov.ref;
  document.getElementById("tallas").value = prov.tallas;
  document.getElementById("cantidad").value = prov.cantidad;

  // Eliminar el jean actual de la lista para volver a guardarlo editado
  proveedores.splice(index, 1);
  guardarEnLocalStorage();
  mostrarProveedores();
}

// Eliminar registro
function eliminarProveedor(index) {
  if (confirm("¿Deseas eliminar este jean?")) {
    proveedores.splice(index, 1);
    guardarEnLocalStorage();
    mostrarProveedores();
  }
}

// Limpiar campos del formulario
function limpiarCampos() {
  document.querySelectorAll("input[type='text']").forEach(i => i.value = "");
  document.getElementById("imagen").value = "";
}

// Mostrar los datos al cargar la página
mostrarProveedores();
