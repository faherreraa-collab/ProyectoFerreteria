document.addEventListener("DOMContentLoaded", () => {
    const userDisplay = document.getElementById("user-display");
    const btnLogout = document.getElementById("btn-logout");
    const modalLogout = document.getElementById("modal-logout");
    const btnConfirmLogout = document.getElementById("btn-confirm-logout");
    const btnCancelLogout = document.getElementById("btn-cancel-logout");

    // --- 4 VALIDACIONES JS EN DASHBOARD ---
    
    // 1. Validar que exista usuario en sesión
    
    const usuarioActivo = JSON.parse(localStorage.getItem("usuario_activo"));
    if (!usuarioActivo || !usuarioActivo.nombre) {
        alert("Acceso denegado. Debe iniciar sesión.");
        window.location.href = "login.html";
        return;
    } else {
        userDisplay.textContent = usuarioActivo.nombre;
    }

    // 2. Validar estructura de productos al calcular métrica
    const productos = JSON.parse(localStorage.getItem("catalogo_productos")) || [];
    document.getElementById("total-productos").textContent = Array.isArray(productos) ? productos.length : 0;

    // 3. Validar métricas de despachos y servicios
    const despachos = JSON.parse(localStorage.getItem("despachos")) || [];
    const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
    const reportes = JSON.parse(localStorage.getItem("reportes")) || [];

    document.getElementById("total-despachos").textContent = Array.isArray(despachos) ? despachos.length : 0;
    document.getElementById("total-servicios").textContent = Array.isArray(servicios) ? servicios.length : 0;
    document.getElementById("total-reportes").textContent = Array.isArray(reportes) ? reportes.length : 0;

    // 4. Validar disponibilidad de menú lateral (prevenir clics en enlaces rotos)
    const links = document.querySelectorAll(".sidebar-nav .nav-item");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            if (link.getAttribute("href") === "#") {
                e.preventDefault();
                alert("Este módulo se encuentra temporalmente deshabilitado.");
            }
        });
    });

    // Eventos Modal Logout
    btnLogout.addEventListener("click", () => modalLogout.style.display = "flex");
    btnCancelLogout.addEventListener("click", () => modalLogout.style.display = "none");
    btnConfirmLogout.addEventListener("click", () => {
        localStorage.removeItem("usuario_activo");
        window.location.href = "login.html";
    });
});