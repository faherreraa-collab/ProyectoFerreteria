document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-servicio");
    const clienteInput = document.getElementById("cliente");
    const tipoSelect = document.getElementById("tipo-servicio");
    const diasInput = document.getElementById("dias");
    const telefonoInput = document.getElementById("telefono");
    const errorMsg = document.getElementById("error-msg");
    const listaServicios = document.getElementById("lista-servicios");

    const modal = document.getElementById("modal-servicio");
    const modalDetalle = document.getElementById("modal-detalle");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

    cargarServicios();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const cliente = clienteInput.value.trim();
        const servicio = tipoSelect.value;
        const dias = parseInt(diasInput.value, 10);
        const telefono = telefonoInput.value.trim();

        // --- 4 VALIDACIONES MEDIANTE JAVASCRIPT ---

        // Validación 1: Campos requeridos
        if (!cliente || !servicio || !diasInput.value || !telefono) {
            errorMsg.textContent = "Todos los campos son obligatorios.";
            return;
        }

        // Validación 2: Nombre del cliente con mínimo 3 letras
        if (cliente.length < 3) {
            errorMsg.textContent = "El nombre del cliente debe tener al menos 3 caracteres.";
            return;
        }

        // Validación 3: Rango de días entre 1 y 30
        if (isNaN(dias) || dias < 1 || dias > 30) {
            errorMsg.textContent = "Los días de arriendo deben estar comprendidos entre 1 y 30 días.";
            return;
        }

        // Validación 4: Formato de teléfono (Exactamente 9 números)
        const regexTel = /^[0-9]{9}$/;
        if (!regexTel.test(telefono)) {
            errorMsg.textContent = "El teléfono debe contener exactamente 9 dígitos numéricos.";
            return;
        }

        // Guardado de datos
        const nuevoServicio = { cliente, servicio, dias, telefono };
        guardarServicio(nuevoServicio);
        form.reset();

        // Modal
        modalDetalle.textContent = `Servicio reservado para ${cliente}: Arriendo de ${servicio} por ${dias} día(s).`;
        modal.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    function guardarServicio(item) {
        const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
        servicios.push(item);
        localStorage.setItem("servicios", JSON.stringify(servicios));
        cargarServicios();
    }

    function cargarServicios() {
        listaServicios.innerHTML = "";
        const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

        servicios.forEach(s => {
            const li = document.createElement("li");
            li.textContent = `${s.cliente} - Arriendo: ${s.servicio} (${s.dias} días) - Tel: ${s.telefono}`;
            listaServicios.appendChild(li);
        });
    }
});