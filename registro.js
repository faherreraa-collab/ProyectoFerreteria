document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");
    const confirmPassInput = document.getElementById("confirm-password");
    const errorMsg = document.getElementById("error-msg");

    const modal = document.getElementById("modal-registro");
    const modalTexto = document.getElementById("modal-texto");
    const btnIrLogin = document.getElementById("btn-ir-login");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const password = passInput.value.trim();
        const confirmPass = confirmPassInput.value.trim();

        // --- 4 VALIDACIONES JS ---
        // 1. Campos obligatorios
        if (!nombre || !email || !password || !confirmPass) {
            errorMsg.textContent = "Todos los campos son obligatorios.";
            return;
        }

        // 2. Nombre con al menos 3 caracteres
        if (nombre.length < 3) {
            errorMsg.textContent = "El nombre debe tener al menos 3 caracteres.";
            return;
        }

        // 3. Contraseña de al menos 6 caracteres
        if (password.length < 6) {
            errorMsg.textContent = "La contraseña debe tener un mínimo de 6 caracteres.";
            return;
        }

        // 4. Las contraseñas coinciden
        if (password !== confirmPass) {
            errorMsg.textContent = "Las contraseñas no coinciden.";
            return;
        }

        // Guardar usuario en localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        usuarios.push({ nombre, email, password, rol: "Cliente" });
        localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));

        form.reset();
        modalTexto.textContent = `Usuario ${nombre} registrado con éxito.`;
        modal.style.display = "flex";
    });

    btnIrLogin.addEventListener("click", () => {
        window.location.href = "login.html";
    });
});