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
if (!localStorage.getItem('favoritos')) {
    localStorage.setItem('favoritos', JSON.stringify([]));
}
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
            irAInfo(cancion);
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
    
    const canciones = document.querySelectorAll('.cancion-favorita');
    canciones.forEach((cancionElement, index) => {
        cancionElement.addEventListener('click', function(e) {

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


function letraCancion (idArtista, idCancion) {
    const letra = 'https://api.lyrics.ovh/v1/' + idArtista + '/' + idCancion;

    html += `
    <div class="letra" id="letra">
        <p class = "cancion-letra"> ${letra} </p>
    </div>
    `;
}

document.addEventListener('DOMContentLoaded', function() {

    const btnInicio = document.querySelector('.btn-inicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    const btnPremium = document.querySelector('.premium');
    if (btnPremium) {
        btnPremium.addEventListener('click', function() {
            window.location.href = 'html/premium.html'; 
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
            mostrarInfoArtista(artista);
        };
        
        contenedor.appendChild(divArtista);
    }

    if (artistasUnicos.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-biblioteca">No se encontraron artistas</p>';
    }
}

function mostrarInfoArtista(artista) {

    const cancionFicticia = {
        title: artista.name + " - Artista",
        artist: {
            name: artista.name,
            picture_medium: artista.picture_medium,
            picture_big: artista.picture_big || artista.picture_medium
        },
        album: {
            title: "Artista - " + artista.name,
            cover_medium: artista.picture_medium,
            cover_big: artista.picture_big || artista.picture_medium
        }
    };
    
    localStorage.setItem('cancionSeleccionada', JSON.stringify(cancionFicticia));
    
    window.location.href = 'html/info.html';
}

if (window.location.pathname.includes("info.html")) {
    
    const cancion = JSON.parse(localStorage.getItem("cancionSeleccionada"));

    if (cancion) {

        const portada = document.getElementById("portada");
        const imagenArtista = document.getElementById("imagenArtista");
        const infoDiv = document.querySelector(".info");
        const letraDiv = document.querySelector(".letra");

      
        portada.src = cancion.album.cover_big;

        document.body.style.backgroundImage = `url(${cancion.album.cover_big})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backdropFilter = "blur(10px)";

    
        imagenArtista.src = cancion.artist.picture_medium;


        infoDiv.innerHTML = `
            <h2>${cancion.title}</h2>
            <p><strong>Artista:</strong> ${cancion.artist.name}</p>
            <p><strong>Álbum:</strong> ${cancion.album.title}</p>
        `;
        obtenerLetraCancion(cancion.artist.name, cancion.title)
            .then(letra => letraDiv.innerHTML = `<pre>${letra}</pre>`)
            .catch(() => letraDiv.innerHTML = "<p>No se encontró la letra.</p>");
    }
}


function obtenerLetraCancion(artista, titulo) {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(titulo)}`;

    return fetch(url)
        .then(res => res.json())
        .then(data => data.lyrics ? data.lyrics : "Letra no disponible");
}

function irAInfo(cancion) {
    localStorage.setItem('cancionSeleccionada', JSON.stringify(cancion));
    window.open("html/info.html", "_blank");
}