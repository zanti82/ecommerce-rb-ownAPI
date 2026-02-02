//variables globales

/*********************************************************************/
/********** carga usuarios desde la api y msql ***********************/
/*********************************************************************/
const API_BASE_URL = 'http://localhost:8081/api';

// para validar que se conecte
async function cargarUsuarios() {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    const usuarios = await response.json();
    return usuarios;
}
cargarUsuarios().then(usuarios => {
    console.log('Usuarios en el sistema:', usuarios);
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

const $btnSignIn = document.querySelector('.sign-in-btn');
const $btnSignUp = document.querySelector('.sign-up-btn');
const $signUp = document.querySelector('.container-form.sign-up');
const $signIn = document.querySelector('.container-form.sign-in');

document.addEventListener('click', e => {
    // Lógica para cambiar entre el formulario de inicio de sesión y registro
    if (e.target === $btnSignIn || e.target === $btnSignUp) {
        
        $signIn.classList.toggle('active'); 
        $signUp.classList.toggle('active');
    }
});



// --- REGISTRO DE USUARIOS ---

const registerBtn = document.querySelector('.container-form.sign-up input[value="Registrarse"]');


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
    // se borra el role, porque al inicio solo son clientes, luego se puede modificar en usuarios

    if (!documentoId || !nombre || !email || !password || !telefono ||!direccion) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert("Por favor, ingresa un email válido.");
        return;
    }
  
    let url = `${API_BASE_URL}/auth/register`; //url para pasarla al fetch con el method
    let method = 'POST';
    const nuevoUsuario= {
        
        documento : documentoId,
        name: nombre,
        mail: email,
        password : password,
        phoneNumber : telefono,
        address : direccion,
        role : 'cliente'
    }
    try {
        const response = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nuevoUsuario)
           
        });

        const data = await response.json();
       
        if (response.ok) {
             // Registro exitoso
             alert(`¡Registro exitoso! Tu ID es: ${data.id}\n\nYa puedes iniciar sesión.`);
            
             // Limpiar formulario
             inputs.forEach(input => input.value = '');
             
             // Cambiar a formulario de login
             $signUp.classList.remove('active');
             $signIn.classList.add('active');
        }else{
            alert(`Error: ${data.mensaje || 'No se pudo completar el registro'}`);
        }
        
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor.');
    }
    
   
});


/*********************************************************************/
/********** login con java como api            ***********************/
/*********************************************************************/

const loginBtn = document.querySelector('.container-form.sign-in input[value="Iniciar Sesion"]');

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const inputs = $signIn.querySelectorAll('input:not([type="button"])'); //selecciona los input menso el button
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    // Validar campos vacíos
    if (!email || !password) {
        alert("⚠️ Por favor, ingresa tu correo y contraseña.");
        return;
    }
    
    const credenciales = {
       email: email,
       password: password //datos deben coinciidr con java
    }

    try {
        // Le pedimos a Java que verifique
        const response = await fetch(`${API_BASE_URL}/auth/login`, { // Ajusta tu ruta de login
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales)
        });

        if (response.ok) {
            const usuario = await response.json(); // Java nos devuelve el objeto usuario si es correcto
            
            alert(`¡Bienvenido de nuevo, ${usuario.name}!`);

            // Guardamos solo el usuario que SE LOGUEÓ para mantener la sesión, 
            // no la lista completa de todos los usuarios.
            // Guardar sesión en localStorage
            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
            localStorage.setItem('userId', usuario.id);
            localStorage.setItem('userRol', usuario.role);

            console.log(usuario.role)
            console.log(usuario.email)


            // Redirección basada en el rol que viene de la DB
            if (usuario.role === "admin") {
                window.location.href = "adminpage.html";
            } else {
                window.location.href = "hombre.html";
            }
        } else {
            const error = await response.json();
            alert(` ${error.mensaje || 'Correo o contraseña incorrectos'}`);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('❌ Servidor fuera de servicio. Intenta más tarde.');
    }
});


window.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    
    if (usuarioActivo) {
        const usuario = JSON.parse(usuarioActivo);
        console.log(`✅ Sesión activa: ${usuario.nombre} (${usuario.rol})`);
        
        // Opcional: Redirigir automáticamente si ya hay sesión
        // if (usuario.rol === 'ADMIN') {
        //     window.location.href = "adminpage.html";
        // } else {
        //     window.location.href = "hombre.html";
        // }
    }
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