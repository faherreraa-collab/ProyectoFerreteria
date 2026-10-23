document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-usuario");
    const nombreInput = document.getElementById("usr-nombre");
    const emailInput = document.getElementById("usr-email");
    const rolSelect = document.getElementById("usr-rol");
    const pinInput = document.getElementById("usr-pin");
    const errorMsg = document.getElementById("error-msg");
    const tablaBody = document.querySelector("#tabla-usuarios tbody");

    const modal = document.getElementById("modal-usuario");
    const modalTexto = document.getElementById("modal-texto");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

    cargarUsuarios();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const rol = rolSelect.value;
        const pin = pinInput.value.trim();

        // --- 4 VALIDACIONES JS ---
        // 1. Campos no vacíos
        if (!nombre || !email || !rol || !pin) {
            errorMsg.textContent = "Todos los campos deben ser completados.";
            return;
        }

        // 2. Nombre de usuario mínimo de 4 letras
        if (nombre.length < 4) {
            errorMsg.textContent = "El nombre del usuario debe tener al menos 4 caracteres.";
            return;
        }

        // 3. Elección de Rol requerida
        if (rol === "") {
            errorMsg.textContent = "Debe seleccionar un rol para el usuario.";
            return;
        }

        // 4. PIN exacto de 4 dígitos numéricos
        const regexPin = /^[0-9]{4}$/;
        if (!regexPin.test(pin)) {
            errorMsg.textContent = "El PIN debe ser exactamente de 4 dígitos numéricos.";
            return;
        }

        const nuevoUsuario = { nombre, email, rol };
        const usuarios = JSON.parse(localStorage.getItem("lista_usuarios_sistema")) || [];
        usuarios.push(nuevoUsuario);
        localStorage.setItem("lista_usuarios_sistema", JSON.stringify(usuarios));

        form.reset();
        cargarUsuarios();

        modalTexto.textContent = `Se ha creado el usuario ${nombre} con el rol de ${rol}.`;
        modal.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    function cargarUsuarios() {
        tablaBody.innerHTML = "";
        const usuarios = JSON.parse(localStorage.getItem("lista_usuarios_sistema")) || [];
        usuarios.forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${u.nombre}</td><td>${u.email}</td><td>${u.rol}</td>`;
            tablaBody.appendChild(tr);
        });
    }
});