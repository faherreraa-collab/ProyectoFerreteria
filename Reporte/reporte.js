// Espera a que el documento esté listo antes de buscar y usar sus elementos.
document.addEventListener("DOMContentLoaded", () => {
    // Controles del formulario para seleccionar los parámetros del reporte.
    const form = document.getElementById("form-selector-reporte");
    const tipoReporteSelect = document.getElementById("tipo-reporte");
    const rangoFechaSelect = document.getElementById("rango-fecha");
    const formatoExportSelect = document.getElementById("formato-export");
    const errorMsg = document.getElementById("error-msg");

    // Elementos donde se muestra el reporte generado.
    const areaReporte = document.getElementById("contenido-reporte");
    const placeholder = document.getElementById("placeholder-reporte");
    const repTitulo = document.getElementById("rep-titulo");
    const repFecha = document.getElementById("rep-fecha-generacion");
    const repKpiGrid = document.getElementById("rep-kpi-grid");
    const repTablaContainer = document.getElementById("rep-tabla-container");

    // Elementos del cuadro modal que confirma la generación del reporte.
    const modal = document.getElementById("modal-reporte");
    const modalTexto = document.getElementById("modal-texto");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

    // Procesa el envío del formulario y genera el reporte si las opciones son válidas.
    form.addEventListener("submit", (e) => {
        // Evita que el navegador recargue la página al enviar el formulario.
        e.preventDefault();
        // Limpia cualquier error mostrado durante un intento anterior.
        errorMsg.textContent = "";

        // Lee los valores elegidos para utilizarlos en las validaciones y el reporte.
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
        // Conserva los filtros y la fecha para recordar la consulta en el navegador.
        const ultimaConsulta = { tipo, rango, formato, fechaConsulta: new Date().toLocaleString() };
        localStorage.setItem("ultimo_reporte_generado", JSON.stringify(ultimaConsulta));

        // Renderizar Reporte Ficticio según la selección
        // Actualiza el contenido del reporte usando el tipo y el rango seleccionados.
        generarDatosFicticios(tipo, rango);

        // Mostrar Modal de confirmación
        // Informa al usuario que el reporte se generó con el formato elegido.
        modalTexto.textContent = `Reporte generado exitosamente con el formato '${formato}'.`;
        modal.style.display = "flex";
    });

    // Cierra el cuadro modal cuando se presiona su botón de cierre.
    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Muestra los datos de ejemplo que corresponden al tipo de reporte seleccionado.
    function generarDatosFicticios(tipo, rango) {
        // Oculta el mensaje inicial y habilita el área con los resultados.
        placeholder.style.display = "none";
        areaReporte.style.display = "block";
        // Indica la fecha en que se generó la vista actual del reporte.
        repFecha.textContent = `Generado el: ${new Date().toLocaleDateString()}`;

        // Presenta indicadores y una tabla de ejemplo para el reporte de ventas.
        if (tipo === "ventas") {
            // Actualiza el título y las tarjetas con el resumen de ventas.
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
            // Presenta los productos con más ventas y sus indicadores principales.
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
            // Muestra un resumen de compras realizadas para reabastecer el inventario.
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

// Glosario de conceptos utilizados en este archivo:
// DOM: estructura de elementos HTML que el navegador representa en la página.
// DOMContentLoaded: evento que indica que el HTML ya fue cargado y puede manipularse.
// addEventListener: método que ejecuta una función cuando ocurre un evento.
// const: declara una variable cuyo valor no se reasigna.
// getElementById: busca un elemento HTML usando el valor de su atributo id.
// value: propiedad que permite leer el valor seleccionado en un control de formulario.
// preventDefault: evita el comportamiento predeterminado del navegador, como recargar al enviar.
// textContent: lee o cambia el texto de un elemento sin interpretar etiquetas HTML.
// innerHTML: lee o reemplaza el contenido de un elemento interpretando etiquetas HTML.
// localStorage: almacenamiento del navegador que conserva datos entre visitas.
// JSON.stringify: convierte un objeto de JavaScript en una cadena JSON.
// if / else if: estructuras condicionales que ejecutan bloques según una condición.
// return: termina la ejecución de la función actual.
// Template literal: cadena entre comillas invertidas que permite insertar valores con ${...}.
// Función: bloque reutilizable de instrucciones; puede recibir parámetros y ejecutarse.
// Parámetro: dato recibido por una función; en este caso, tipo y rango.
// KPI: indicador clave de rendimiento que resume una métrica importante.