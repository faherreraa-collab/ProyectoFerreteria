document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-despacho");
    const numOrdenInput = document.getElementById("num-orden");
    const direccionInput = document.getElementById("direccion");
    const comunaSelect = document.getElementById("comuna");
    const fechaInput = document.getElementById("fecha-despacho");
    const errorMsg = document.getElementById("error-msg");
    const tablaBody = document.querySelector("#tabla-despachos tbody");
    
    const modal = document.getElementById("modal-confirmacion");
    const modalTexto = document.getElementById("modal-texto");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

    // Cargar datos almacenados al iniciar
    cargarDespachos();

    // Event Listener para envío del formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const numOrden = numOrdenInput.value.trim();
        const direccion = direccionInput.value.trim();
        const comuna = comunaSelect.value;
        const fecha = fechaInput.value;

        // --- 4 VALIDACIONES MEDIANTE JAVASCRIPT ---
        
        // Validación 1: Campos no vacíos
        if (!numOrden || !direccion || !comuna || !fecha) {
            errorMsg.textContent = "Todos los campos son obligatorios.";
            return;
        }

        // Validación 2: Longitud mínima del número de orden
        if (numOrden.length < 4) {
            errorMsg.textContent = "El número de orden debe tener al menos 4 caracteres.";
            return;
        }

        // Validación 3: Selección válida en el selector de comuna
        if (comuna === "") {
            errorMsg.textContent = "Por favor seleccione una comuna válida.";
            return;
        }

        // Validación 4: La fecha no puede ser anterior al día de hoy
        const fechaSeleccionada = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaSeleccionada < hoy) {
            errorMsg.textContent = "La fecha de despacho no puede ser una fecha pasada.";
            return;
        }

        // Si pasa las validaciones:
        const nuevoDespacho = { numOrden, direccion, comuna, fecha };
        guardarDespacho(nuevoDespacho);
        form.reset();

        // Mostrar Modal
        modalTexto.textContent = `El pedido ${numOrden} ha sido programado para entrega el ${fecha} en ${comuna}.`;
        modal.style.display = "flex";
    });

    // Event Listener para cerrar modal
    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    function guardarDespacho(despacho) {
        const despachos = JSON.parse(localStorage.getItem("despachos")) || [];
        despachos.push(despacho);
        localStorage.setItem("despachos", JSON.stringify(despachos));
        cargarDespachos();
    }

    function cargarDespachos() {
        tablaBody.innerHTML = "";
        const despachos = JSON.parse(localStorage.getItem("despachos")) || [];
        
        despachos.forEach(d => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${d.numOrden}</td>
                <td>${d.direccion}</td>
                <td>${d.comuna}</td>
                <td>${d.fecha}</td>
            `;
            tablaBody.appendChild(tr);
        });
    }
});