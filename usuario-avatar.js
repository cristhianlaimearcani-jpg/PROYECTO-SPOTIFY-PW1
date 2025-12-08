// usuario-avatar.js - Transformar botón en avatar
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar si el usuario está logueado
    function usuarioEstaLogueado() {
        return localStorage.getItem('is_logged_in') === 'true';
    }
    
    // Obtener el botón de iniciar sesión
    const botonIniciarSesion = document.querySelector('.btn-iniciar');
    
    if (botonIniciarSesion && usuarioEstaLogueado()) {
        transformarBotonEnAvatar(botonIniciarSesion);
    }
    
    // Función para transformar el botón en avatar
    function transformarBotonEnAvatar(boton) {
        const email = localStorage.getItem('usuario_actual');
        const iniciales = localStorage.getItem('usuario_iniciales') || obtenerIniciales(email);
        
        // Crear el avatar circular
        boton.innerHTML = '';
        boton.style.cssText = `
            color: black;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            border: 2px solid white;
            cursor: pointer;
            transition: all 0.3s;
            min-width: 50px;
        `;
        
        boton.textContent = iniciales;
        

        boton.title = `Usuario: ${email}`;
        
        boton.replaceWith(boton.cloneNode(true));
        const nuevoBoton = document.querySelector('.btn-iniciar');

        nuevoBoton.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarMenuUsuario(this);
        });
        
        nuevoBoton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        nuevoBoton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
    }
    

    function mostrarMenuUsuario(avatar) {
        const menuAnterior = document.querySelector('.menu-usuario');
        if (menuAnterior) {
            menuAnterior.remove();
            return;
        }
        
        const email = localStorage.getItem('usuario_actual');
        const plan = localStorage.getItem('mi_plan') || 'Spotify FREE';
        
        // Crear menú
        const menu = document.createElement('div');
        menu.className = 'menu-usuario';
        menu.style.cssText = `
            position: absolute;
            top: 70px;
            right: 20px;
            background: black;
            border-radius: 10px;
            padding: 20px;
            width: 250px;
            z-index: 10000;
            animation: aparecerMenu 0.3s ease;
        `;
        
        // Contenido del menú
        menu.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 20px;
                    color: white;
                    margin: 0 auto 10px;
                    border: 2px solid white;
                ">
                    ${localStorage.getItem('usuario_iniciales') || 'U'}
                </div>
                <h4 style="margin: 5px 0; color: white;">${email || 'Usuario'}</h4>
                <p style="color: white; font-size: 12px; margin: 5px 0;">${plan}</p>
            </div>
            
            <hr style=" margin: 15px 0;">
            
            <button id="btn-cerrar-sesion" style="
                background: #ff4444;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 20px;
                width: 100%;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
                margin-bottom: 10px;
            ">
                Cerrar Sesión
            </button>
            
            <button id="btn-cerrar-menu" style="
                background: #333;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 20px;
                width: 100%;
                cursor: pointer;
                transition: all 0.3s;
            ">
                Cerrar
            </button>
        `;
        
        document.body.appendChild(menu);
        const estilo = document.createElement('style');
        estilo.textContent = `
            @keyframes aparecerMenu {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(estilo);

        document.getElementById('btn-cerrar-sesion').addEventListener('click', function() {
            cerrarSesion();
        });
        
        document.getElementById('btn-cerrar-menu').addEventListener('click', function() {
            menu.remove();
        });

        setTimeout(() => {
            document.addEventListener('click', function cerrarMenuExterno(e) {
                if (!menu.contains(e.target) && e.target !== avatar && !avatar.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', cerrarMenuExterno);
                }
            });
        }, 100);
    }
    
    function cerrarSesion() {
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('usuario_actual');
        localStorage.removeItem('usuario_iniciales');
        alert('Sesión cerrada exitosamente');
        window.location.reload();
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

    if (usuarioEstaLogueado() && document.querySelector('.btn-iniciar')) {
        transformarBotonEnAvatar(document.querySelector('.btn-iniciar'));
    }
});
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('is_logged_in') === 'true') {
        const linkRegistrate = document.getElementById('link-registrate');
        if (linkRegistrate) {
            linkRegistrate.remove(); 
        }
    }
});