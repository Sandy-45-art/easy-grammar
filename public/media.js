var sidenav =document.querySelector(".side-navbar");

function showNavbar(){
    sidenav.style.left="0";
}

function closeNavbar(){
    sidenav.style.left="-110%";
}

window.showNavbar = showNavbar;
window.closeNavbar = closeNavbar;