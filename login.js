document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-login");
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");
    const errorMsg = document.getElementById("error-msg");

    const modal = document.getElementById("modal-login");
    const modalTexto = document.getElementById("modal-texto");
    const btnEntrar = document.getElementById("btn-entrar");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const email = emailInput.value.trim();
        const password = passInput.value.trim();

        // --- 4 VALIDACIONES JS ---
        // 1. Campos requeridos
        if (!email || !password) {
            errorMsg.textContent = "Ingrese correo y contraseña.";
            return;
        }

        // 2. Formato simple de Email
        if (!email.includes("@") || !email.includes(".")) {
            errorMsg.textContent = "El correo electrónico no es válido.";
            return;
        }

        // 3. Longitud de contraseña mínima
        if (password.length < 4) {
            errorMsg.textContent = "La contraseña debe tener al menos 4 caracteres.";
            return;
        }

        // 4. Verificación de credenciales (Admin por defecto o usuarios guardados)
        const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        const esAdmin = (email === "admin@ferre.cl" && password === "admin123");
        const usuarioEncontrado = usuariosGuardados.find(u => u.email === email && u.password === password);

        if (!esAdmin && !usuarioEncontrado) {
            errorMsg.textContent = "Credenciales incorrectas o usuario no registrado.";
            return;
        }

        // Guardar sesión activa
        const nombreUsuario = esAdmin ? "Administrador" : usuarioEncontrado.nombre;
        localStorage.setItem("usuario_activo", JSON.stringify({ email, nombre: nombreUsuario }));

        modalTexto.textContent = `Sesión iniciada correctamente como ${nombreUsuario}.`;
        modal.style.display = "flex";
    });

    btnEntrar.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
});