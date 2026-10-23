document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-inventario");
    const codigoInput = document.getElementById("inv-codigo");
    const bodegaSelect = document.getElementById("inv-bodega");
    const cantidadInput = document.getElementById("inv-cantidad");
    const responsableInput = document.getElementById("inv-responsable");
    const errorMsg = document.getElementById("error-msg");
    const lista = document.getElementById("lista-inventario");

    const modal = document.getElementById("modal-inventario");
    const modalTexto = document.getElementById("modal-texto");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

    cargarInventario();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const codigo = codigoInput.value.trim();
        const bodega = bodegaSelect.value;
        const cantidad = parseInt(cantidadInput.value, 10);
        const responsable = responsableInput.value.trim();

        // --- 4 VALIDACIONES JS ---
        // 1. Campos requeridos
        if (!codigo || !bodega || !cantidadInput.value || !responsable) {
            errorMsg.textContent = "Por favor llene todos los campos.";
            return;
        }

        // 2. Longitud del código (mínimo 3 caracteres)
        if (codigo.length < 3) {
            errorMsg.textContent = "El código de artículo debe contener al menos 3 caracteres.";
            return;
        }

        // 3. Cantidad positiva mayor a cero
        if (isNaN(cantidad) || cantidad <= 0) {
            errorMsg.textContent = "La cantidad ingresada debe ser un entero mayor a 0.";
            return;
        }

        // 4. Nombre del responsable mínimo 3 caracteres
        if (responsable.length < 3) {
            errorMsg.textContent = "Escriba un nombre de responsable válido (mín. 3 letras).";
            return;
        }

        const movimiento = { codigo, bodega, cantidad, responsable, fecha: new Date().toLocaleTimeString() };
        const registros = JSON.parse(localStorage.getItem("inventario_movimientos")) || [];
        registros.push(movimiento);
        localStorage.setItem("inventario_movimientos", JSON.stringify(registros));

        form.reset();
        cargarInventario();

        modalTexto.textContent = `Se ingresaron ${cantidad} unidades de [${codigo}] en ${bodega}.`;
        modal.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    function cargarInventario() {
        lista.innerHTML = "";
        const registros = JSON.parse(localStorage.getItem("inventario_movimientos")) || [];
        registros.forEach(m => {
            const li = document.createElement("li");
            li.textContent = `[${m.fecha}] Código: ${m.codigo} | Bodega: ${m.bodega} | Cantidad: ${m.cantidad} | Resp: ${m.responsable}`;
            lista.appendChild(li);
        });
    }
});