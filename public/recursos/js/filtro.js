document.addEventListener("DOMContentLoaded", () => {
  const filtroNombre = document.getElementById("filtroNombre");
  const filtroPrecioMin = document.getElementById("filtroPrecioMin");
  const filtroPrecioMax = document.getElementById("filtroPrecioMax");
  const ordenarPor = document.getElementById("ordenarPor");
  const limpiarBtn = document.getElementById("limpiarFiltros");
  const contenedor = document.getElementById("contenedor-productos");
  const mensaje = document.getElementById("mensaje-sin-resultados");
  const ordenOriginal = obtenerProductos();

  function obtenerProductos() {
    return Array.from(contenedor.getElementsByClassName("producto"));
  }

  function filtrarProductos() {
    const nombre = filtroNombre.value.toLowerCase();
    const precioMin = parseFloat(filtroPrecioMin.value) || 0;
    const precioMax = parseFloat(filtroPrecioMax.value) || Infinity;

    let hayResultados = false;

    obtenerProductos().forEach(producto => {
      const nombreProducto = producto.dataset.nombre.toLowerCase();
      const precioProducto = parseFloat(producto.dataset.precio);

      const coincideNombre = nombreProducto.includes(nombre);
      const dentroRango = precioProducto >= precioMin && precioProducto <= precioMax;

      const mostrar = coincideNombre && dentroRango;
      producto.style.display = mostrar ? "block" : "none";

      if (mostrar) hayResultados = true;
    });

    mensaje.style.display = hayResultados ? "none" : "block";
  }

  function ordenarProductos() {
    const criterio = ordenarPor.value;
    const productos = obtenerProductos();

    productos.sort((a, b) => {
      const nombreA = a.dataset.nombre.toLowerCase();
      const nombreB = b.dataset.nombre.toLowerCase();
      const precioA = parseFloat(a.dataset.precio);
      const precioB = parseFloat(b.dataset.precio);

      switch (criterio) {
        case "precio-asc":
          return precioA - precioB;
        case "precio-desc":
          return precioB - precioA;
        case "nombre-asc":
          return nombreA.localeCompare(nombreB);
        case "nombre-desc":
          return nombreB.localeCompare(nombreA);
        default:
          return 0;
      }
    });

    productos.forEach(p => contenedor.appendChild(p)); // Reordenar DOM
  }

  // Listeners de filtros y orden
  filtroNombre.addEventListener("input", filtrarProductos);
  filtroPrecioMin.addEventListener("input", filtrarProductos);
  filtroPrecioMax.addEventListener("input", filtrarProductos);
  ordenarPor.addEventListener("change", () => {
    ordenarProductos();
    filtrarProductos(); // Refiltrar después de ordenar
  });

  limpiarBtn.addEventListener("click", () => {
    filtroNombre.value = "";
    filtroPrecioMin.value = "";
    filtroPrecioMax.value = "";
    ordenarPor.value = "";

    ordenOriginal.forEach(p => contenedor.appendChild(p)); // Restaurar orden original
    filtrarProductos();
  });

  // Mostrar información en el modal
  const botonesComprar = document.querySelectorAll(".btn-comprar");

  botonesComprar.forEach(boton => {
    boton.addEventListener("click", e => {
      const producto = e.target.closest(".producto");
      const nombre = producto.dataset.nombre;
      const precio = producto.dataset.precio;
      const descripcion = producto.dataset.descripcion;

      const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      const imagen = `./recursos/${nombreCapitalizado}.png`;

      document.getElementById("modalProductoLabel").textContent = nombreCapitalizado;
      document.getElementById("modal-nombre").textContent = nombreCapitalizado;
      document.getElementById("modal-precio").textContent = `$${precio} MXN`;
      document.getElementById("modal-descripcion").textContent = descripcion;
      document.getElementById("modal-img").src = imagen;

      const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
      modal.show();
    });
  });

  // === CARRITO ===
  const btnAgregarCarrito = document.getElementById("btn-agregar-carrito"); // botón del modal
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");
  const contadorCarrito = document.getElementById("contador-carrito");

  let carrito = [];

  btnAgregarCarrito.addEventListener("click", () => {
  const nombre = document.getElementById("modal-nombre").textContent;
  const precioTexto = document.getElementById("modal-precio").textContent.replace(/[^0-9.]/g, "");
  const precio = parseFloat(precioTexto);
  const imagen = document.getElementById("modal-img").src;
  const cantidad = parseInt(document.getElementById("modal-cantidad").value) || 1; // ← CANTIDAD DEL INPUT

  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad }); // ← GUARDAMOS la cantidad elegida
  }

  actualizarCarrito();

  // Resetear la cantidad en el modal a 1
  document.getElementById("modal-cantidad").value = 1;
});



  function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary";

    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.imagen}" alt="${item.nombre}" class="me-3 rounded" style="width: 50px; height: 50px; object-fit: cover;">
        <div>
          <strong>${item.nombre}</strong><br>
          <small>$${item.precio.toFixed(2)} x ${item.cantidad}</small>
        </div>
      </div>
      <div>
        <span class="fw-bold">$${(item.precio * item.cantidad).toFixed(2)}</span>
        <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDelCarrito(${index})">×</button>
      </div>
    `;

    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;
    listaCarrito.appendChild(li);
  });

  totalCarrito.textContent = total.toFixed(2);
  contadorCarrito.textContent = cantidadTotal;
}


  window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
  }

  // Inicia con filtrado por si ya hay valores
  filtrarProductos();
});
