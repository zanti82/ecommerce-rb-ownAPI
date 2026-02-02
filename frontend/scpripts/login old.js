//variables globales

/*********************************************************************/
/********** carga usuarios desde la api y msql ***********************/
/*********************************************************************/
const API_BASE_URL = 'http://localhost:8081/api';
async function cargarUsuarios() {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    const usuarios = await response.json();
    return usuarios;
    
}

/********** funciones para amnejo del local storge carrito 
const USUARIOS_LOCAL_STORAGE= "usuarios";


function CargarDatosUsuariosLS(){
    return JSON.parse(localStorage.getItem(USUARIOS_LOCAL_STORAGE)) || [];
  
}

function guardarDatosUsuariosLS(usuarios){
    localStorage.setItem(USUARIOS_LOCAL_STORAGE,JSON.stringify(usuarios)) || [];
}

let usuarios= CargarDatosUsuariosLS()

*/

//este condigo se usa una vez para cargar datos de usuario facilemnete

/*const admin1= { cedula: "1111", nombre: "SANTIAGO", email:"s@s.com", 
                password:"1111", direccion: "crr 1111", telefono: "111", rol:"admin"};
const admin2= { cedula: "1111", nombre: "MARICELA", email:"m@m.com", 
                password:"1111", direccion: "crr 1111", telefono: "111", rol:"admin"};
const admin3= { cedula: "1111", nombre: "JULIAN", email:"j@j.com", 
                password:"1111", direccion: "crr 1111", telefono: "111", rol:"admin"};
const admin4= { cedula: "1111", nombre: "MARIA", email:"x@x.com", 
    password:"1111", direccion: "crr 1111", telefono: "111", rol:"admin"};

usuarios.push(admin1);
usuarios.push(admin2);    
usuarios.push(admin3);    
usuarios.push(admin4);        

guardarDatosUsuariosLS(usuarios);

console.log(usuarios); //para verificar que hay*/
//------------------------------------------------


const $btnSignIn = document.querySelector('.sign-in-btn'),
      $btnSignUp = document.querySelector('.sign-up-btn'),
     
      //selectores para los formularios
      $signUp = document.querySelector('.container-form.sign-up'),
      $signIn = document.querySelector('.container-form.sign-in');

document.addEventListener('click', e => {
    // Lógica para cambiar entre el formulario de inicio de sesión y registro
    if (e.target === $btnSignIn || e.target === $btnSignUp) {
        
        $signIn.classList.toggle('active'); 
        $signUp.classList.toggle('active');
    }
});



// --- REGISTRO DE USUARIOS ---

const registerBtn = document.querySelector('.container-form.sign-up input[value="Registrarse"]');
const usuarios = cargarUsuarios();

registerBtn.addEventListener('click', async(e) => {
    e.preventDefault(); 
    
    // Busca los inputs dentro del contenedor de registro
    const inputs = $signUp.querySelectorAll('input:not([type="button"])'); 
    const documentoId = inputs[0].value.trim();
    const nombre = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const password = inputs[3].value.trim();
    const telefono = inputs[4].value.trim();
    const direccion = inputs[5].value.trim();
    const rol = 'cliente';

    if (!documentoId || !nombre || !email || !password || !telefono ||!direccion) {
        alert("Por favor, completa todos los campos.");
        return;
    }
  
    /* Verificar si ya existe el id(ya no se usa porque el que verifica es el handler de java)

    const existe = usuarios.find(u => u.document === documentoId);
    if (existe) {
        alert("⚠️ Este Usuario ya está registrado. Inicia sesión.");
        return;
    }*/

    /* esto ya no lo necesitamo, porque ya teneos que traer la base de datos y hacer el create
    usuarios.push({ documentoId, nombre, email, password, telefono, direccion,  rol : "cliente" });
    guardarDatosUsuariosLS(usuarios);*/

    let url = `${API_BASE_URL}/usuarios`; //url para pasarla al fetch con el method
    let method = 'POST';
    const clienteData = {
        
        documento : documentoId,
        name: nombre,
        mail: email,
        password : password,
        phoneNumber : telefono,
        address : direccion,
        role : rol
    }
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteData)
           
        });
       
        if (!response.ok) {
            // Si el servidor devuelve un error, lo mostramos
            const errorData = await response.json();
            alert('Error al guardar cliente ya registrado: ' + errorData.mensaje);
            return;
        }else{
            alert(`Creacion cliente nuevo exitosa con id`)
            inputs.forEach(input => input.value = '');
        }
        
        } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con el servidor.');
    }
    console.log(usuarios);
   
});

// --- INICIO DE SESIÓN Y REDIRECCIÓN --- antiguo con local storage
/*
const loginBtn = document.querySelector('.container-form.sign-in input[value="Iniciar Sesion"]');

loginBtn.addEventListener('click', () => {

    // Busca los inputs dentro del contenedor de inicio de sesión
    const inputs = $signIn.querySelectorAll('input:not([type="button"])'); 
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();
    
    // ** CONFIGURA AQUÍ LA PÁGINA DE DESTINO **
    const PAGINA_DESTINO_Admin = "adminpage.html"; // Tu archivo de destino
    const PAGINA_DESTINO_Cliente = "hombre.html"; // Tu archivo de destino

    
    if (!email || !password) {
        alert("Por favor, ingresa tu correo y contraseña.");
        return;
    }

   
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        if(usuario.rol === "admin"){
            alert(`👋 Bienvenido super admin, ${usuario.nombre}! Has iniciado sesión correctamente.`);
             // Guardar el estado de la sesión
         localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
        
            //direccionamiento
            window.location.href = PAGINA_DESTINO_Admin; 
        }else{
            alert(`👋 Bienvenido, ${usuario.nombre}! Has iniciado sesión correctamente.`);
             // Guardar el estado de la sesión
         localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
             //direccionamiento
            window.location.href = PAGINA_DESTINO_Cliente; 
        }
       

    } else {
        alert("❌ Correo o contraseña incorrectos.");
    }
});

// --- OPCIONAL: Mantener sesión activa (Para la consola) ---
window.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioActivo) {
        console.log(`Sesión activa: ${usuarioActivo.nombre}`);
    }
}); */

/*********************************************************************/
/********** login con java como api            ***********************/
/*********************************************************************/

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const inputs = $signIn.querySelectorAll('input:not([type="button"])'); 
    const datosLoggin = {
        mail: inputs[0].value.trim(),
        password: inputs[1].value.trim()
    };

    try {
        // Le pedimos a Java que verifique
        const response = await fetch(`${API_BASE_URL}/auth/login`, { // Ajusta tu ruta de login
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosLoggin)
        });

        if (response.ok) {
            const usuario = await response.json(); // Java nos devuelve el objeto usuario si es correcto
            
            alert(`👋 ¡Bienvenido de nuevo, ${usuario.name}!`);

            // Guardamos solo el usuario que SE LOGUEÓ para mantener la sesión, 
            // no la lista completa de todos los usuarios.
            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

            // Redirección basada en el rol que viene de la DB
            if (usuario.role === "admin") {
                window.location.href = "adminpage.html";
            } else {
                window.location.href = "hombre.html";
            }
        } else {
            alert("❌ Correo o contraseña incorrectos.");
        }
    } catch (error) {
        alert("Servidor fuera de servicio.");
    }
});


