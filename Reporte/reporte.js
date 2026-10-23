document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-selector-reporte");
    const tipoReporteSelect = document.getElementById("tipo-reporte");
    const rangoFechaSelect = document.getElementById("rango-fecha");
    const formatoExportSelect = document.getElementById("formato-export");
    const errorMsg = document.getElementById("error-msg");

    const areaReporte = document.getElementById("contenido-reporte");
    const placeholder = document.getElementById("placeholder-reporte");
    const repTitulo = document.getElementById("rep-titulo");
    const repFecha = document.getElementById("rep-fecha-generacion");
    const repKpiGrid = document.getElementById("rep-kpi-grid");
    const repTablaContainer = document.getElementById("rep-tabla-container");

    const modal = document.getElementById("modal-reporte");
    const modalTexto = document.getElementById("modal-texto");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        errorMsg.textContent = "";

        const tipo = tipoReporteSelect.value;
        const rango = rangoFechaSelect.value;
        const formato = formatoExportSelect.value;

        // --- 4 VALIDACIONES JS ---

        // 1. Selección obligatoria del tipo de reporte
        if (!tipo) {
            errorMsg.textContent = "Por favor seleccione qué tipo de reporte desea generar.";
            return;
        }

        // 2. Selección de rango de tiempo
        if (!rango) {
            errorMsg.textContent = "Debe elegir un rango de tiempo para calcular los datos.";
            return;
        }

        // 3. Selección del formato de salida
        if (!formato) {
            errorMsg.textContent = "Por favor elija un formato de presentación.";
            return;
        }

        // 4. Validar que la combinación solicitada sea ejecutable (ejemplo de regla de negocio)
        if (tipo === "compras_inventario" && rango === "7dias") {
            errorMsg.textContent = "El reporte de inventario requiere un rango mínimo de un mes para ser representativo.";
            return;
        }

        // Guardar la última consulta realizada en localStorage
        const ultimaConsulta = { tipo, rango, formato, fechaConsulta: new Date().toLocaleString() };
        localStorage.setItem("ultimo_reporte_generado", JSON.stringify(ultimaConsulta));

        // Renderizar Reporte Ficticio según la selección
        generarDatosFicticios(tipo, rango);

        // Mostrar Modal de confirmación
        modalTexto.textContent = `Reporte generado exitosamente con el formato '${formato}'.`;
        modal.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    function generarDatosFicticios(tipo, rango) {
        placeholder.style.display = "none";
        areaReporte.style.display = "block";
        repFecha.textContent = `Generado el: ${new Date().toLocaleDateString()}`;

        if (tipo === "ventas") {
            repTitulo.textContent = "📊 Informe General de Ventas Realizadas";
            repKpiGrid.innerHTML = `
                <div class="kpi-box"><small>Total Facturado</small><strong>$4.850.000</strong></div>
                <div class="kpi-box"><small>Transacciones</small><strong>142</strong></div>
                <div class="kpi-box"><small>Ticket Promedio</small><strong>$34.155</strong></div>
            `;
            repTablaContainer.innerHTML = `
                <table>
                    <thead><tr><th>N° Folio</th><th>Cliente</th><th>Monto</th><th>Método Pago</th></tr></thead>
                    <tbody>
                        <tr><td>#VEN-101</td><td>Juan Pérez</td><td>$45.000</td><td>Efectivo</td></tr>
                        <tr><td>#VEN-102</td><td>Constructora del Sur</td><td>$1.200.000</td><td>Transferencia</td></tr>
                        <tr><td>#VEN-103</td><td>Maria Silva</td><td>$18.500</td><td>Débito</td></tr>
                    </tbody>
                </table>
            `;
        } else if (tipo === "productos_vendidos") {
            repTitulo.textContent = "📦 Ranking de Productos Más Vendidos";
            repKpiGrid.innerHTML = `
                <div class="kpi-box"><small>Producto Estrella</small><strong>Cemento Melón 25kg</strong></div>
                <div class="kpi-box"><small>Unidades Vendidas</small><strong>450 un.</strong></div>
            `;
            repTablaContainer.innerHTML = `
                <table>
                    <thead><tr><th>Producto</th><th>Categoría</th><th>Unidades Vendidas</th><th>Total Generado</th></tr></thead>
                    <tbody>
                        <tr><td>Saco Cemento 25kg</td><td>Materiales</td><td>450</td><td>$2.025.000</td></tr>
                        <tr><td>Martillo Galponero 16oz</td><td>Herramientas</td><td>120</td><td>$1.188.000</td></tr>
                        <tr><td>Pintura Esmalte Agua 1Gal</td><td>Pinturas</td><td>85</td><td>$1.615.000</td></tr>
                    </tbody>
                </table>
            `;
        } else if (tipo === "compras_inventario") {
            repTitulo.textContent = "🏭 Resumen de Reabastecimiento e Inventario Comprado";
            repKpiGrid.innerHTML = `
                <div class="kpi-box"><small>Inversión en Stock</small><strong>$3.100.000</strong></div>
                <div class="kpi-box"><small>Órdenes a Proveedor</small><strong>8 Pedidos</strong></div>
            `;
            repTablaContainer.innerHTML = `
                <table>
                    <thead><tr><th>Cod. Pedido</th><th>Proveedor</th><th>Artículos Ingresados</th><th>Costo Total</th></tr></thead>
                    <tbody>
                        <tr><td>#IMP-881</td><td>Distribuidora Makita</td><td>15 Taladros Impacto</td><td>$1.350.000</td></tr>
                        <tr><td>#IMP-882</td><td>Ladrillos Santiago</td><td>2000 Unidades Ladrillo</td><td>$900.000</td></tr>
                    </tbody>
                </table>
            `;
        }
    }
});