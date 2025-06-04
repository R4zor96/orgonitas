import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule, // Importa CommonModule para *ngFor y *ngIf
    FormsModule, // Importa FormsModule para ngModel
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

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.applyFilters();
  }

  // Aplicar filtros y ordenamiento
  applyFilters() {
    // Filtrar por nombre
    let filtered = this.products.filter((product) => {
      return product.nombre
        .toLowerCase()
        .includes(this.filterNombre.toLowerCase());
    });

    // Filtrar por precio
    filtered = filtered.filter((product) => {
      const min = this.filterPrecioMin ?? 0;
      const max = this.filterPrecioMax ?? Number.MAX_VALUE;
      return product.precio >= min && product.precio <= max;
    });

    // Ordenar
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
  }

  // Limpiar todos los filtros
  limpiarFiltros() {
    this.filterNombre = '';
    this.filterPrecioMin = null;
    this.filterPrecioMax = null;
    this.ordenarPor = '';
    this.applyFilters();
  }

  // Abrir modal de producto
  openProductModal(content: any, product: any) {
    this.selectedProduct = product;
    this.cantidad = 1;
    this.modalService.open(content, {
      centered: true,
      windowClass: 'dark-modal',
    });
  }

  // Agregar producto al carrito
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

  // Eliminar producto del carrito
  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarCarrito();
  }

  // Actualizar totales del carrito
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

  // Finalizar compra
  finalizarCompra() {
    alert(`¡Compra finalizada! Total: $${this.totalCarrito} MXN`);
    this.carrito = [];
    this.actualizarCarrito();
    this.modalService.dismissAll();
  }
}
