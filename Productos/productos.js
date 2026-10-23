document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-producto");
    const nombreInput = document.getElementById("prod-nombre");
    const categoriaSelect = document.getElementById("prod-categoria");
    const precioInput = document.getElementById("prod-precio");
    const stockInput = document.getElementById("prod-stock");
    const errorMsg = document.getElementById("error-msg");
    const gridProductos = document.getElementById("grid-productos");

    const modal = document.getElementById("modal-producto");
    const modalTexto = document.getElementById("modal-texto");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

    cargarProductos();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const nombre = nombreInput.value.trim();
        const categoria = categoriaSelect.value;
        const precio = parseFloat(precioInput.value);
        const stock = parseInt(stockInput.value, 10);

        // --- 4 VALIDACIONES JS ---
        // 1. Campos requeridos
        if (!nombre || !categoria || !precioInput.value || !stockInput.value) {
            errorMsg.textContent = "Todos los campos son obligatorios.";
            return;
        }

        // 2. Nombre del producto con mín 3 letras
        if (nombre.length < 3) {
            errorMsg.textContent = "El nombre del producto debe tener al menos 3 caracteres.";
            return;
        }

        // 3. Precio mínimo de $100
        if (isNaN(precio) || precio < 100) {
            errorMsg.textContent = "El precio del producto debe ser de al menos $100.";
            return;
        }

        // 4. Stock no negativo (0 o mayor)
        if (isNaN(stock) || stock < 0) {
            errorMsg.textContent = "El stock inicial no puede ser un número negativo.";
            return;
        }

        const producto = { nombre, categoria, precio, stock };
        const productos = JSON.parse(localStorage.getItem("catalogo_productos")) || [];
        productos.push(producto);
        localStorage.setItem("catalogo_productos", JSON.stringify(productos));

        form.reset();
        cargarProductos();

        modalTexto.textContent = `Se agregó "${nombre}" ($${precio.toLocaleString()}) al catálogo.`;
        modal.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    function cargarProductos() {
        gridProductos.innerHTML = "";
        const productos = JSON.parse(localStorage.getItem("catalogo_productos")) || [];

        if (productos.length === 0) {
            gridProductos.innerHTML = "<p>No hay productos registrados en el catálogo.</p>";
            return;
        }

        productos.forEach(p => {
            const card = document.createElement("div");
            card.className = "prod-card";
            card.innerHTML = `
                <h4>${p.nombre}</h4>
                <p class="cat">${p.categoria}</p>
                <p class="precio">$${p.precio.toLocaleString()}</p>
                <p class="stock">Stock: ${p.stock} un.</p>
            `;
            gridProductos.appendChild(card);
        });
    }
});