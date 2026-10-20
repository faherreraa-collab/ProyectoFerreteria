// ============================================================
// MÓDULO DESPACHO - Inventario Ferretería
// ============================================================

// ---------- 1. Datos y referencias al DOM ----------
const CLAVE = 'despachos';                           // nombre con que se guarda en localStorage
const ORDEN_ESTADOS = ['Pendiente', 'En ruta', 'Entregado'];

const form = document.getElementById('form-despacho');
const tabla = document.getElementById('tabla-despachos');
const botonGuardar = form.querySelector('button[type="submit"]');
const CAMPOS = ['receptor', 'producto', 'cantidad', 'direccion', 'fecha', 'estado'];

let despachos = leerDespachos();   // lista de despachos en memoria
let idEditando = null;             // null = creando uno nuevo; número = editando

// ---------- 2. localStorage: guardar y leer ----------
function leerDespachos() {
  try {
    // localStorage solo guarda texto, por eso usamos JSON.parse
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch (error) {
    return [];
  }
}

function guardarDespachos() {
  // JSON.stringify convierte la lista en texto para poder guardarla
  localStorage.setItem(CLAVE, JSON.stringify(despachos));
}

// ---------- 3. Mostrar la tabla (manipulación del DOM) ----------
function mostrarTabla() {
  tabla.innerHTML = '';

  if (despachos.length === 0) {
    const fila = tabla.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 7;
    celda.textContent = 'No hay despachos registrados.';
    return;
  }

  despachos.forEach(function (d) {
    const fila = tabla.insertRow();

    // Una celda por cada dato (textContent evita meter HTML por error)
    [d.receptor, d.producto, d.cantidad, d.direccion, d.fecha, d.estado].forEach(function (valor) {
      fila.insertCell().textContent = valor;
    });

    // Celda de acciones con dos botones
    const celdaAcciones = fila.insertCell();

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', function () {
      editarDespacho(d.id);
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.addEventListener('click', function () {
      eliminarDespacho(d.id);
    });

    celdaAcciones.appendChild(btnEditar);
    celdaAcciones.appendChild(btnEliminar);
  });
}

// ---------- 4. Validaciones ----------
function hoyISO() {
  // Fecha de hoy en formato AAAA-MM-DD (el mismo que entrega <input type="date">)
  const h = new Date();
  const mes = String(h.getMonth() + 1).padStart(2, '0');
  const dia = String(h.getDate()).padStart(2, '0');
  return h.getFullYear() + '-' + mes + '-' + dia;
}

function validar(datos) {
  const errores = {};
  const original = idEditando !== null
    ? despachos.find(function (d) { return d.id === idEditando; })
    : null;

  // Revisiones básicas para que el formulario funcione
  if (datos.receptor === '') errores.receptor = 'Ingresa el nombre del receptor.';
  if (datos.producto === '') errores.producto = 'Ingresa el producto.';

  // VALIDACIÓN 1: la dirección debe tener al menos 5 caracteres
  if (datos.direccion.length < 5) {
    errores.direccion = 'La dirección debe tener al menos 5 caracteres.';
  }

  // VALIDACIÓN 2: la cantidad debe ser un entero entre 1 y 500
  const cantidad = Number(datos.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 500) {
    errores.cantidad = 'La cantidad debe ser un número entero entre 1 y 500.';
  }

  // VALIDACIÓN 3: la fecha de entrega no puede ser anterior a hoy
  // (al editar, solo se revisa si cambiaste la fecha, para poder marcar "Entregado" después)
  if (datos.fecha === '') {
    errores.fecha = 'Selecciona la fecha de entrega.';
  } else if ((original === null || datos.fecha !== original.fecha) && datos.fecha < hoyISO()) {
    errores.fecha = 'La fecha de entrega no puede ser anterior a hoy.';
  }

  // VALIDACIÓN 4: el estado no puede retroceder (Pendiente → En ruta → Entregado)
  if (original !== null) {
    const estadoNuevo = ORDEN_ESTADOS.indexOf(datos.estado);
    const estadoAnterior = ORDEN_ESTADOS.indexOf(original.estado);
    if (estadoNuevo < estadoAnterior) {
      errores.estado = 'El estado no puede retroceder (era "' + original.estado + '").';
    }
  }

  return errores;
}

function mostrarErrores(errores) {
  for (const campo in errores) {
    document.getElementById('error-' + campo).textContent = errores[campo];
    document.getElementById(campo).classList.add('invalido');
  }
}

function limpiarErrores() {
  CAMPOS.forEach(function (campo) {
    document.getElementById('error-' + campo).textContent = '';
    document.getElementById(campo).classList.remove('invalido');
  });
}

// ---------- 5. Guardar (crear o actualizar) ----------
form.addEventListener('submit', function (evento) {
  evento.preventDefault();   // evita que la página se recargue
  limpiarErrores();

  // Leemos lo que escribió el usuario (trim quita espacios sobrantes)
  const datos = {
    receptor: document.getElementById('receptor').value.trim(),
    producto: document.getElementById('producto').value.trim(),
    cantidad: document.getElementById('cantidad').value,
    direccion: document.getElementById('direccion').value.trim(),
    fecha: document.getElementById('fecha').value,
    estado: document.getElementById('estado').value
  };

  const errores = validar(datos);
  if (Object.keys(errores).length > 0) {
    mostrarErrores(errores);
    return;                  // si hay errores, no se guarda nada
  }

  datos.cantidad = Number(datos.cantidad);

  if (idEditando === null) {
    datos.id = Date.now();   // id único basado en la hora actual
    despachos.push(datos);
  } else {
    const posicion = despachos.findIndex(function (d) { return d.id === idEditando; });
    datos.id = idEditando;
    despachos[posicion] = datos;
    idEditando = null;
    botonGuardar.textContent = 'Guardar despacho';
  }

  guardarDespachos();
  mostrarTabla();
  form.reset();
});

// ---------- 6. Editar y eliminar ----------
function editarDespacho(id) {
  const d = despachos.find(function (item) { return item.id === id; });
  CAMPOS.forEach(function (campo) {
    document.getElementById(campo).value = d[campo];
  });
  idEditando = id;
  botonGuardar.textContent = 'Actualizar despacho';
  limpiarErrores();
  form.scrollIntoView();
}

function eliminarDespacho(id) {
  if (confirm('¿Eliminar este despacho?')) {
    despachos = despachos.filter(function (d) { return d.id !== id; });
    guardarDespachos();
    mostrarTabla();
  }
}

// ---------- 7. Al abrir la página ----------
mostrarTabla();