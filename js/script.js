// botón del menú y la lista de navegación
const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');


menuToggle.addEventListener('click', () => {
    
    navUl.classList.toggle('active');
});