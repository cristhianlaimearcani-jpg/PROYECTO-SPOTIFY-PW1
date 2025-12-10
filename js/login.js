document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.sign form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;

            localStorage.setItem('user_email', email);
            localStorage.setItem('user_password', password);
            
            alert('Registro exitoso! Ahora puedes iniciar sesión');
            
            setTimeout(function() {
                window.location.href = 'html/iniciar-secion.html';
            }, 1000);
        });
    }
  
    const loginForm = document.querySelector('.login form');
    if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        const savedEmail = localStorage.getItem('user_email');
        const savedPassword = localStorage.getItem('user_password');
        
        if (email === savedEmail && password === savedPassword) {
            alert('Inicio de sesión exitoso');
            
            localStorage.setItem('is_logged_in', 'true');  
            localStorage.setItem('usuario_actual', email);
            
            const iniciales = obtenerIniciales(email);
            localStorage.setItem('usuario_iniciales', iniciales);
            
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            alert('Email o contraseña incorrectos');
        }
    });
}


function obtenerIniciales(email) {
    if (!email) return 'U';
    

    const nombreUsuario = email.split('@')[0];

    if (nombreUsuario.includes('.')) {
        const partes = nombreUsuario.split('.');
        return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombreUsuario.substring(0, 2).toUpperCase();
}
    
 
    const ayudaForm = document.querySelector('.contactanos form');
    if (ayudaForm) {
        console.log("Formulario de ayuda detectado");
        
        ayudaForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
    
            const email = this.querySelector('input[type="email"]').value;
            const problema = this.querySelector('input[type="text"]').value;
            
            if (!email || !problema) {
                alert('Por favor, completa todos los campos');
                return;
            }
            
            const problemas = JSON.parse(localStorage.getItem('problemas_ayuda')) || [];
            problemas.push({
                email: email,
                problema: problema,
                fecha: new Date().toLocaleString()
            });
            localStorage.setItem('problemas_ayuda', JSON.stringify(problemas));

            alert('Tu problema está siendo atendido\n\nNos pondremos en contacto contigo pronto');

            setTimeout(function() {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
    

    const botonesPlanes = document.querySelectorAll('.planes button');
    if (botonesPlanes.length > 0) {

        function estaLogueado() {

            const sesion1 = localStorage.getItem('is_logged_in') === 'true';
            const sesion2 = localStorage.getItem('sesion_activa') === 'true';
            return sesion1 || sesion2;
        }
        
        botonesPlanes.forEach(boton => {
            boton.addEventListener('click', function() {
                if (!estaLogueado()) {
                    alert('Primero debes iniciar sesión');
                    setTimeout(() => {
                        window.location.href = 'html/iniciar-secion.html';
                    }, 1500);
                    return;
                }

                const usuario = localStorage.getItem('user_email') || 
                               localStorage.getItem('usuario_actual') || 
                               'Usuario';
                const planNombre = this.textContent;

                localStorage.setItem('mi_plan', planNombre);
                localStorage.setItem('plan_seleccionado', planNombre);
                
                alert(`Felicidades ${usuario}!\n\nHas seleccionado el plan: ${planNombre}\n\nTu plan ha sido activado exitosamente`);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            });
        });
    }
});