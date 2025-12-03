const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("btn-nav"); 
    abrir.style.display = "none";  
    cerrar.style.display = "block"; 
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("btn-nav"); 
    cerrar.style.display = "none";   
    abrir.style.display = "block";
});