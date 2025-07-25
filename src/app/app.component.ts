import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Productos
  products = [
    {
      nombre: 'Orgonita de Equilibrio',
      precio: 250,
      descripcion:
        'Ayuda a equilibrar la energía interna y armonizar los espacios. Ideal para meditación.',
      imagen: './recursos/Orgonita de Equilibrio.png',
    },
    {
      nombre: 'Orgonita de Protección',
      precio: 300,
      descripcion:
        'Bloquea energías negativas del entorno. Ideal para hogares o lugares con mucho estrés.',
      imagen: './recursos/Orgonita de Protección.png',
    },
    {
      nombre: 'Orgonita Floral',
      precio: 280,
      descripcion:
        'Diseño inspirado en flores, otorga frescura energética al ambiente.',
      imagen: './recursos/Orgonita Floral.png',
    },
  ];

  // Variables para filtrado
  filteredProducts = [...this.products];
  filterNombre = '';
  filterPrecioMin: number | null = null;
  filterPrecioMax: number | null = null;
  ordenarPor = '';

  // Variables para el modal de producto
  selectedProduct: any = null;
  cantidad = 1;

  // Carrito
  carrito: any[] = [];
  totalCarrito = 0;
  contadorCarrito = 0;

  // Lógica slider simple
  currentIndex = 0;

  // Variables para modal de registro
  registerData = {
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  celular: '',
  correo: '',
  password: '',
  rol: 'usuario', // Valor por defecto
  calle: '',
  numero: '',
  colonia: '',
  cp: '',
  municipio: '',
  estado: '',
  referencias: ''
};

  // Variables para modal de login
  loginData = {
    correo: '',
    password: ''
  };

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.applyFilters();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.filteredProducts.length) %
      this.filteredProducts.length;
  }

  applyFilters() {
    let filtered = this.products.filter((product) => {
      return product.nombre
        .toLowerCase()
        .includes(this.filterNombre.toLowerCase());
    });

    filtered = filtered.filter((product) => {
      const min = this.filterPrecioMin ?? 0;
      const max = this.filterPrecioMax ?? Number.MAX_VALUE;
      return product.precio >= min && product.precio <= max;
    });

    if (this.ordenarPor) {
      filtered.sort((a, b) => {
        switch (this.ordenarPor) {
          case 'precio-asc':
            return a.precio - b.precio;
          case 'precio-desc':
            return b.precio - a.precio;
          case 'nombre-asc':
            return a.nombre.localeCompare(b.nombre);
          case 'nombre-desc':
            return b.nombre.localeCompare(a.nombre);
          default:
            return 0;
        }
      });
    }

    this.filteredProducts = filtered;
    this.currentIndex = 0;
  }

  limpiarFiltros() {
    this.filterNombre = '';
    this.filterPrecioMin = null;
    this.filterPrecioMax = null;
    this.ordenarPor = '';
    this.applyFilters();
  }

  openProductModal(content: any, product: any) {
    this.selectedProduct = product;
    this.cantidad = 1;
    this.modalService.open(content, {
      centered: true,
      windowClass: 'dark-modal',
    });
  }

  agregarAlCarrito() {
    if (!this.selectedProduct) return;

    const existente = this.carrito.find(
      (item) => item.nombre === this.selectedProduct.nombre
    );

    if (existente) {
      existente.cantidad += this.cantidad;
    } else {
      this.carrito.push({
        ...this.selectedProduct,
        cantidad: this.cantidad,
      });
    }

    this.actualizarCarrito();
    this.modalService.dismissAll();
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarCarrito();
  }

  actualizarCarrito() {
    this.totalCarrito = this.carrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );

    this.contadorCarrito = this.carrito.reduce(
      (count, item) => count + item.cantidad,
      0
    );
  }

  finalizarCompra() {
    alert(`¡Compra finalizada! Total: $${this.totalCarrito} MXN`);
    this.carrito = [];
    this.actualizarCarrito();
    this.modalService.dismissAll();
  }

  openCartModal(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'dark-modal',
      size: 'lg',
    });
  }

  // Modal Registro
  openRegisterModal(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'dark-modal',
      size: 'md',
    });
  }

  register() {
  const data = this.registerData;
  if (
    !data.nombre || !data.apellido_paterno || !data.apellido_materno ||
    !data.celular || !data.correo || !data.password
  ) {
    alert('Por favor, completa los campos obligatorios.');
    return;
  }

  // Aquí podrías enviar los datos a tu backend usando HttpClient

  alert(`Usuario ${data.nombre} registrado correctamente.`);

  this.registerData = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    celular: '',
    correo: '',
    password: '',
    rol: 'usuario',
    calle: '',
    numero: '',
    colonia: '',
    cp: '',
    municipio: '',
    estado: '',
    referencias: ''
  };

  this.modalService.dismissAll();
}

  // Modal Login
  openLoginModal(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'dark-modal',
      size: 'md',
    });
  }

  login() {
    if (!this.loginData.correo || !this.loginData.password) {
      alert('Por favor, completa todos los campos de inicio de sesión.');
      return;
    }

    alert(`Usuario con correo ${this.loginData.correo} inició sesión correctamente.`);

    this.loginData = {
      correo: '',
      password: ''
    };

    this.modalService.dismissAll();
  }
}
