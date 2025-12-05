/* MENU HAMBURGUESA SIMPLE */
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("activo");
    abrir.style.display = "none";
    cerrar.style.display = "block"; 
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("activo");
    cerrar.style.display = "none";   
    abrir.style.display = "block";  
});
/* api */
window.onload = function() {
    cargarCancionesInicio();
    configurarBuscador();
};

function cargarCancionesInicio() {
    buscarYMostrar('eminem', 'contenedor-fila-1');
    buscarYMostrar('bad bunny', 'contenedor-fila-2');
    buscarYMostrar('shakira', 'contenedor-fila-3');
}

function buscarYMostrar(nombreArtista, idContenedor) {
    const url = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + encodeURIComponent(nombreArtista);
    const headers = {
        'x-rapidapi-key': '6c58c63818mshfc6993a6a3f5849p1008fcjsnd00d4c93158b',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    };
    
    fetch(url, { headers: headers })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos && datos.data) {
                mostrarCanciones(datos.data, idContenedor);
            }
        });
}

function mostrarCanciones(listaCanciones, idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    for (let i = 0; i < 4 && i < listaCanciones.length; i++) {
        const cancion = listaCanciones[i];
        const divCancion = document.createElement('div');
        divCancion.className = 'item';
        
        divCancion.innerHTML = `
            <img src="${cancion.album.cover_medium}" alt="${cancion.title}">
            <div class="texto">
                <p>${cancion.title.substring(0, 20)}${cancion.title.length > 20 ? '...' : ''}</p>    
            </div>
            <div class="segundo-texto">
                <p>${cancion.artist.name}</p>
            </div>
        `;
        divCancion.onclick = function() {
            reproducirCancion(cancion);
            mostrarInfoEnSidebar(cancion);
        };
        
        contenedor.appendChild(divCancion);
    }
}

function reproducirCancion(cancion) {
    let reproductor = document.getElementById('reproductor-musica');
    
    if (!reproductor) {
        reproductor = document.createElement('div');
        reproductor.id = 'reproductor-musica';
        reproductor.className = 'reproductor-musica';
        document.body.appendChild(reproductor);
    }

    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const esFavorita = favoritos.some(fav => fav.id === cancion.id);
    const colorCorazon = esFavorita ? 'red' : 'white';
    
    reproductor.innerHTML = `
        <div class="reproductor-contenido">
            <img src="${cancion.album.cover_small}" alt="${cancion.title}">
            <div class="texto-cancion">
                <p><strong>${cancion.title}</strong></p>
                <p>${cancion.artist.name}</p>
            </div>
            <audio controls autoplay>
                <source src="${cancion.preview}" type="audio/mpeg">
            </audio>
        </div>
    `;
    
    reproductor.style.display = 'block';
}

function configurarBuscador() {
    const buscar = document.getElementById('buscador');
    
    buscar.addEventListener('keypress', function(evento) {
        if (evento.key === 'Enter') {
            const texto = buscar.value.trim();
            if (texto === '') {
                cargarCancionesInicio();
                ponerTitulosNormales();
            } else {
                buscarTodo(texto);
            }
        }
    });
    
    const btnBuscar = document.getElementById('barra-buscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', function() {
            const texto = buscar.value.trim();
            if (texto === '') {
                cargarCancionesInicio();
                ponerTitulosNormales();
            } else {
                buscarTodo(texto);
            }
        });
    }
}

function buscarTodo(texto) {
    document.getElementById('titulo-fila-1').textContent = 'Resultados para: ' + texto;
    document.getElementById('titulo-fila-2').textContent = 'Más resultados';
    document.getElementById('titulo-fila-3').textContent = 'Más resultados';
    
    const url = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + encodeURIComponent(texto) + '&limit=12';
    const headers = {
        'x-rapidapi-key': '6c58c63818mshfc6993a6a3f5849p1008fcjsnd00d4c93158b',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    };
    
    fetch(url, { headers: headers })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos && datos.data) {
                const todas = datos.data;
                mostrarCanciones(todas.slice(0, 4), 'contenedor-fila-1');
                mostrarCanciones(todas.slice(4, 8), 'contenedor-fila-2');
                mostrarCanciones(todas.slice(8, 12), 'contenedor-fila-3');
            }
        });
}

function ponerTitulosNormales() {
    document.getElementById('titulo-fila-1').textContent = 'Canciones en tendencia';
    document.getElementById('titulo-fila-2').textContent = 'Artistas populares';
    document.getElementById('titulo-fila-3').textContent = 'Álbumes y sencillos populares';
}

function mostrarInfoEnSidebar(cancion) {
    const sidebar = document.getElementById('sidebar-derecho');
    if (!sidebar) return;
    sidebar.style.display = 'block';
    obtenerInfoArtista(cancion.artist.id);
}

function obtenerInfoArtista(idArtista) {
    const url = 'https://deezerdevs-deezer.p.rapidapi.com/artist/' + idArtista;
    const headers = {
        'x-rapidapi-key': '6c58c63818mshfc6993a6a3f5849p1008fcjsnd00d4c93158b',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    };
    
    fetch(url, { headers: headers })
        .then(respuesta => respuesta.json())
        .then(artista => {
            document.getElementById('foto-artista').src = artista.picture_medium;
            
            document.getElementById('seguidores').textContent = artista.nb_fan;
            document.getElementById('albumes').textContent = artista.nb_album;
            
            document.getElementById('texto-letra').textContent = 
                `${artista.name} tiene ${artista.nb_fan} seguidores y ${artista.nb_album} álbumes.`;
        });
}

function cerrarSidebar() {
    const sidebar = document.getElementById('sidebar-derecho');
    if (sidebar) {
        sidebar.style.display = 'none';
    }
}