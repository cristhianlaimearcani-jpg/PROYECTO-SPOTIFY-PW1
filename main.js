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
    cargarInicio();
    configurarBuscador();
    mostrarFavoritos();
};

function cargarInicio() {
    buscarYMostrar('eminem', 'contenedor-fila-1');
    buscarYMostrar('top artists', 'contenedor-fila-2');
    buscarYMostrar('shakira', 'contenedor-fila-3');
}

function buscarYMostrar(nombreArtista, idContenedor) {
    const limit = idContenedor === 'contenedor-fila-2' ? 50 : 7;
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(nombreArtista)}&limit=${limit}`;
    const headers = {
        'x-rapidapi-key': '6c58c63818mshfc6993a6a3f5849p1008fcjsnd00d4c93158b',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    };
    
    fetch(url, { headers: headers })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos && datos.data) {
                if (idContenedor === 'contenedor-fila-2') {
                    mostrarArtistas(datos.data, idContenedor);
                } else {
                    mostrarCanciones(datos.data, idContenedor);
                }
            }
        });
}

function mostrarCanciones(listaCanciones, idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    for (let i = 0; i < 7 && i < listaCanciones.length; i++) {
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
            <button class="btn-me-gusta" onclick="agregarAFavoritos({
                id: ${cancion.id},
                title: '${cancion.title.replace(/'/g, "\\'")}',
                artist: '${cancion.artist.name.replace(/'/g, "\\'")}',
                cover: '${cancion.album.cover_small}'
            })">
                <i class="fa-solid fa-plus"></i>
            </button>
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
                cargarInicio();
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
    document.getElementById('titulo-fila-2').textContent = 'Artistas relacionados';
    document.getElementById('titulo-fila-3').textContent = 'Más resultados';
    
    const url = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + encodeURIComponent(texto) + '&limit=50';
    const headers = {
        'x-rapidapi-key': '6c58c63818mshfc6993a6a3f5849p1008fcjsnd00d4c93158b',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    };
    
    fetch(url, { headers: headers })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos && datos.data) {
                const todas = datos.data;
                mostrarCanciones(todas.slice(0, 7), 'contenedor-fila-1');
                mostrarArtistas(todas, 'contenedor-fila-2'); // Usar TODAS las canciones
                mostrarCanciones(todas.slice(14, 21), 'contenedor-fila-3');
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

    obtenerLetraCancion(cancion.artist.name, cancion.title);
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

document.addEventListener('DOMContentLoaded', function() {
    const filas = document.querySelectorAll('.fila');
    
    filas.forEach(fila => {
        const btnDer = fila.querySelector('.btn-der');
        const btnIzq = fila.querySelector('.btn-izq');
        const contenedor = fila.querySelector('.contenedor-items');
        
        if (btnDer && btnIzq && contenedor) {
            btnDer.addEventListener("click", () => {
                contenedor.scrollLeft += 180;
                btnDer.style.display= "none";
                btnIzq.style.display= "flex";
            });
            
            btnIzq.addEventListener("click", () => {
                contenedor.scrollLeft -= 180;
                btnDer.style.display= "flex";
                btnIzq.style.display= "none";
            });
        }
    });
});


function agregarAFavoritos(cancion) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos'));
    
    const cancionYaExiste = favoritos.some(fav => fav.id === cancion.id);
    if (!cancionYaExiste) {
        favoritos.push(cancion);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
        mostrarFavoritos();
    } else {
        alert('Cancion ya agregada...');
    }
}

function mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const contenedor = document.getElementById("lista-biblioteca");
    
    if (favoritos.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-biblioteca">Aún no tienes canciones en tu biblioteca...</p>';
        return;
    }
    
    let html = "";
    for (let i = 0; i < favoritos.length; i++) {
        const cancion = favoritos[i];
        
        html += `
            <div class="cancion-favorita">
                <img src="${cancion.cover}" alt="${cancion.title}">
                <div class="info-cancion">
                    <p class="titulo-cancion">${cancion.title}</p>
                    <p class="artista-cancion">${cancion.artist}</p>
                </div>
                <button class="btn-eliminar" onclick="eliminarFavorito(${i}, event)">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }
    contenedor.innerHTML = html;
    
    // Agregar evento para reproducir (clic en toda la canción excepto el botón)
    const canciones = document.querySelectorAll('.cancion-favorita');
    canciones.forEach((cancionElement, index) => {
        cancionElement.addEventListener('click', function(e) {
            // Si hicieron clic en el botón de eliminar, no reproducir
            if (!e.target.closest('.btn-eliminar')) {
                const cancion = favoritos[index];
                buscarYReproducirFavorita(`${cancion.title} ${cancion.artist}`);
            }
        });
    });
}

function eliminarFavorito(index, event) {
    event.stopPropagation();
    
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos.splice(index, 1); 
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos(); 
}

function buscarYReproducirFavorita(busqueda) {
    const url = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(busqueda)}&limit=1`;
    const headers = {
        'x-rapidapi-key': '6c58c63818mshfc6993a6a3f5849p1008fcjsnd00d4c93158b',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
    };
    
    fetch(url, { headers: headers })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos && datos.data && datos.data.length > 0) {

                reproducirCancion(datos.data[0]);
            }
        })
}

function mostrarArtistas(listaCanciones, idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    const artistasUnicos = [];
    const artistasVistos = new Set();
    
    for (let i = 0; i < listaCanciones.length; i++) {
        const cancion = listaCanciones[i];
        const artista = cancion.artist;
        
        if (!artistasVistos.has(artista.id)) {
            artistasVistos.add(artista.id);
            artistasUnicos.push(artista);
            
            if (artistasUnicos.length >= 7) {
                break;
            }
        }
    }
    
    for (let i = 0; i < artistasUnicos.length; i++) {
        const artista = artistasUnicos[i];
        const divArtista = document.createElement('div');
        divArtista.className = 'item';
        
        divArtista.innerHTML = `
            <img src="${artista.picture_medium}" alt="${artista.name}" class="artista">
            <div class="texto">
                <p>${artista.name.substring(0, 20)}${artista.name.length > 20 ? '...' : ''}</p>    
            </div>
            <div class="segundo-texto">
                <p>Artista</p>
            </div>
        `;
        
        divArtista.onclick = function() {
            mostrarInfoArtistaEnSidebar(artista.id);
        };
        
        contenedor.appendChild(divArtista);
    }

    if (artistasUnicos.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-biblioteca">No se encontraron artistas</p>';
    }
}
function mostrarInfoArtistaEnSidebar(idArtista) {
    const sidebar = document.getElementById('sidebar-derecho');
    if (!sidebar) return;
    
    sidebar.style.display = 'block';
    
    const letraElemento = document.getElementById('letra');
    if (letraElemento) {
        letraElemento.innerHTML = '<div class="mensaje-biblioteca">Haz clic en una canción para ver su letra</div>';
    }
    
    obtenerInfoArtista(idArtista);
}

function letraCancion (idArtista, idCancion) {
    const letra = 'https://api.lyrics.ovh/v1/' + idArtista + '/' + idCancion;

    html += `
    <div class="letra" id="letra">
        <p class = "cancion-letra"> ${letra} </p>
    </div>
    `;
}
function obtenerLetraCancion(artista, titulo) {
    artista = artista.replace(/[^\w\s]/gi, '');
    titulo = titulo.replace(/[^\w\s]/gi, '');

    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(titulo)}`;
    
    console.log("Buscando letra para:", artista, "-", titulo);
    console.log("URL:", url);
    
    fetch(url)
        .then(response => {
            console.log("Respuesta recibida, status:", response.status);
            if (!response.ok) {
                throw new Error('Letra no encontrada');
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);
            if (data.lyrics) {
                mostrarLetraEnSidebar(data.lyrics);
            } else {
                mostrarLetraEnSidebar('Letra no disponible para esta canción');
            }
        })
        .catch(error => {
            console.error('Error al buscar letra:', error);
            mostrarLetraEnSidebar('No se pudo cargar la letra de esta canción');
        });
}
function mostrarLetraEnSidebar(letra) {
    const letraElemento = document.getElementById("letra");
    console.log("Elemento letra encontrado:", letraElemento);
    
    if (!letraElemento) {
        console.error("No se encontró el elemento #letra");
        return;
    }
    
    letraElemento.innerHTML = '';
    
    const contenido = document.createElement('div');
    contenido.className = 'letra-contenido';
    
    contenido.innerHTML = `
        <h4>Letra de la canción</h4>
        <div class="texto-letra-cancion">${letra.replace(/\n/g, '<br>')}</div>
    `;
    
    letraElemento.appendChild(contenido);
    console.log("Letra mostrada en sidebar");
}
document.addEventListener('DOMContentLoaded', function() {

    const btnInicio = document.querySelector('.btn-inicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', function() {
            window.location.href = 'Proyecto Pw1.html';
        });
    }
    const btnPremium = document.querySelector('.premium');
    if (btnPremium) {
        btnPremium.addEventListener('click', function() {
            window.location.href = 'premium.html'; 
        });
    
    }
});
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 550) {
        const btnBuscar = document.querySelector('.btn-buscar');
        const buscador = document.getElementById('buscador');
        
        if (btnBuscar && buscador) {
            btnBuscar.addEventListener('click', function() {
                if (buscador.style.display === 'block') {
                    buscador.style.display = 'none';
                } else {
                    buscador.style.display = 'block';
                    buscador.style.width = "90%"
                    buscador.focus();
                }
            });
            
            document.addEventListener('click', function(event) {
                if (!buscador.contains(event.target) && 
                    event.target !== btnBuscar && 
                    !btnBuscar.contains(event.target)) {
                    buscador.style.display = 'none';
                }
            });
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 550) {
        const btnBiblioteca = document.querySelector('.biblioteca');
        const sidebar = document.querySelector('.sidebar');
        
        if (btnBiblioteca && sidebar) {
            const btnSalir = document.createElement('button');
            btnSalir.className = 'btn-salir-biblioteca';
            btnSalir.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            sidebar.appendChild(btnSalir);

            const overlay = document.createElement('div');
            overlay.className = 'overlay-biblioteca';
            document.body.appendChild(overlay);
            

            btnBiblioteca.addEventListener('click', function() {
                sidebar.classList.add('fullscreen');
                overlay.classList.add('activo');
                mostrarFavoritos(); 
            });
            
            btnSalir.addEventListener('click', function() {
                sidebar.classList.remove('fullscreen');
                overlay.classList.remove('activo');
            });
            
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('fullscreen');
                overlay.classList.remove('activo');
            });
        }
    }
});