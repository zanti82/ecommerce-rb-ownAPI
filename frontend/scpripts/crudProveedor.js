let proveedores = [];

function crearProveedor() {
  const nombre = document.getElementById("nombre").value;
  const tipo = document.getElementById("tipo").value;
  const telefono = document.getElementById("telefono").value;
  const correo = document.getElementById("correo").value;
  const direccion = document.getElementById("direccion").value;
  const ciudad = document.getElementById("ciudad").value;

  if (!nombre || !tipo) {
    alert("Por favor ingresa al menos el nombre y tipo del proveedor");
    return;
  }

  const proveedor = { nombre, tipo, telefono, correo, direccion, ciudad };
  proveedores.push(proveedor);
  mostrarProveedores();
  limpiarCampos();
}
// Función para confirmar salida 
function confirmarSalida(event) {
  event.preventDefault(); // evita que el enlace se ejecute de inmediato
  const salir = confirm("¿Estás seguro que deseas salir?");
  if (salir) {
    window.location.href = "login.html";
  } else {
    
  }
}

function mostrarProveedores(lista = proveedores) {
  const tabla = document.getElementById("listaProveedores");
  tabla.innerHTML = "";

  lista.forEach((prov, index) => {
    const fila = `
      <tr>
        <td>${prov.nombre}</td>
        <td>${prov.tipo}</td>
        <td>${prov.telefono}</td>
        <td>${prov.correo}</td>
        <td>${prov.direccion}</td>
        <td>${prov.ciudad}</td>
        <td>
          <button style="background:#28a745" onclick="editarProveedor(${index})">Editar</button>
          <button style="background:#dc3545" onclick="eliminarProveedor(${index})">Eliminar</button>
        </td>
      </tr>
    `;
    tabla.innerHTML += fila;
  });
}

function buscarProveedor() {
  const texto = prompt("Buscar proveedor por nombre o ciudad:");
  if (!texto) return;

  const resultado = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(texto.toLowerCase()) ||
    p.ciudad.toLowerCase().includes(texto.toLowerCase())
  );

  mostrarProveedores(resultado);
}

function editarProveedor(index) {
  const prov = proveedores[index];
  document.getElementById("nombre").value = prov.nombre;
  document.getElementById("tipo").value = prov.tipo;
  document.getElementById("telefono").value = prov.telefono;
  document.getElementById("correo").value = prov.correo;
  document.getElementById("direccion").value = prov.direccion;
  document.getElementById("ciudad").value = prov.ciudad;

  proveedores.splice(index, 1);
  mostrarProveedores();
}

function eliminarProveedor(index) {
  if (confirm("¿Deseas eliminar este proveedor?")) {
    proveedores.splice(index, 1);
    mostrarProveedores();
  }
}

function limpiarCampos() {
  document.querySelectorAll("input").forEach(input => input.value = "");
}
