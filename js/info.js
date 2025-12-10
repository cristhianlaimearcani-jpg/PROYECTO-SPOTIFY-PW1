window.onload = function() {
    cargarCancion();
};

function cargarCancion() {
    const datos = localStorage.getItem('cancionSeleccionada');
    
    if (!datos) {
        mostrarError("No hay canción seleccionada");
        return;
    }
    
    try {
        const cancion = JSON.parse(datos);
        mostrarCancion(cancion);
        buscarLetra(cancion);
    } catch (error) {
        mostrarError("Error al cargar la información");
    }
}

function mostrarCancion(cancion) {
    document.getElementById('tituloCancion').textContent = cancion.title;
    
    const portada = document.getElementById('portada');
    if (cancion.album && cancion.album.cover_medium) {
        portada.src = cancion.album.cover_medium;
    }
    const imgArtista = document.getElementById('imagenArtista');
    if (cancion.artist && cancion.artist.picture_medium) {
        imgArtista.src = cancion.artist.picture_medium;
        document.getElementById('nombreArtista').textContent = cancion.artist.name;
    }
    
    if (cancion.title) {
        document.getElementById('tituloInfo').textContent = cancion.title;
    }
    
    if (cancion.artist && cancion.artist.name) {
        document.getElementById('artistaInfo').textContent = cancion.artist.name;
    }
    
    if (cancion.album && cancion.album.title) {
        document.getElementById('albumInfo').textContent = cancion.album.title;
    }
}

function buscarLetra(cancion) {
    if (!cancion.artist || !cancion.title) {
        document.getElementById('textoLetra').textContent = "No hay información suficiente para buscar la letra";
        return;
    }
    
    const artista = cancion.artist.name;
    const titulo = cancion.title;
    
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(titulo)}`;
    
    fetch(url)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('No se encontró la letra');
            }
            return respuesta.json();
        })
        .then(datos => {
            if (datos.lyrics) {
                document.getElementById('textoLetra').textContent = datos.lyrics;
            }
        })
        .catch(error => {
            document.getElementById('textoLetra').textContent = "Sin letra";
        });
}
