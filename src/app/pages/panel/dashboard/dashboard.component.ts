import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VentaService } from '../../../core/services/venta.service';
import { ProductoService } from '../../../core/services/producto.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  providers: [
    DecimalPipe,
    VentaService,
    ProductoService,
    UsuarioService,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Referencias a los canvas
  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('pieChart') pieChartRef!: ElementRef;

  // Instancias de gráficos
  barChart: any;
  pieChart: any;

  // KPIs
  totalVentas: number = 0;
  ingresosTotales: number = 0;
  clientesActivos: number = 0;
  productoMasVendido: string = '';

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private decimalPipe: DecimalPipe // Inyecta DecimalPipe
  ) {}

  // Método para formatear números
  formatNumber(value: number): string {
    return this.decimalPipe.transform(value, '1.2-2') || '0.00';
  }

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    // Cargar datos de servicios
    this.ventaService.getVentas().subscribe((ventas) => {
      this.totalVentas = ventas.length;
      this.ingresosTotales = ventas.reduce(
        (sum, venta) => sum + venta.costo_total,
        0
      );

      this.productoService.getProductos().subscribe((productos) => {
        this.identificarProductoMasVendido(ventas, productos);
        this.crearGraficos(ventas, productos);
      });
    });

    this.usuarioService.getUsuarios().subscribe((usuarios) => {
      this.clientesActivos = usuarios.filter((u) => u.rol === 'usuario').length;
    });
  }

  identificarProductoMasVendido(ventas: any[], productos: any[]): void {
    const ventasPorProducto = ventas.reduce((acc, venta) => {
      acc[venta.id_producto] = (acc[venta.id_producto] || 0) + venta.cantidad;
      return acc;
    }, {});

    const idMasVendido = Object.keys(ventasPorProducto).reduce((a, b) =>
      ventasPorProducto[a] > ventasPorProducto[b] ? a : b
    );

    const producto = productos.find((p) => p.id_producto === +idMasVendido);
    this.productoMasVendido = producto?.nombre || 'No disponible';
  }

  crearGraficos(ventas: any[], productos: any[]): void {
    // Destruir gráficos existentes si hay
    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();

    // Datos para gráfico de barras (ventas por mes)
    const ventasPorMes = this.agruparVentasPorMes(ventas);

    // Gráfico de barras
    this.barChart = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(ventasPorMes),
        datasets: [
          {
            label: 'Ventas por mes',
            data: Object.values(ventasPorMes),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad de ventas',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Meses',
            },
          },
        },
      },
    });

    // Datos para gráfico circular (ventas por producto)
    const ventasPorProducto = this.agruparVentasPorProducto(ventas, productos);

    // Gráfico circular
    this.pieChart = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ventasPorProducto.map((item) => item.nombre),
        datasets: [
          {
            data: ventasPorProducto.map((item) => item.cantidad),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  private agruparVentasPorMes(ventas: any[]): { [mes: string]: number } {
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return ventas.reduce((acc, venta) => {
      const fecha = new Date(venta.fecha_pedido);
      const clave = `${meses[fecha.getMonth()]}-${fecha.getFullYear()}`;
      acc[clave] = (acc[clave] || 0) + venta.cantidad;
      return acc;
    }, {});
  }

  private agruparVentasPorProducto(ventas: any[], productos: any[]): any[] {
    const ventasAgrupadas = ventas.reduce((acc, venta) => {
      acc[venta.id_producto] = (acc[venta.id_producto] || 0) + venta.cantidad;
      return acc;
    }, {});

    return Object.keys(ventasAgrupadas)
      .map((id) => {
        const producto = productos.find((p) => p.id_producto === +id);
        return {
          nombre: producto?.nombre || `Producto ${id}`,
          cantidad: ventasAgrupadas[id],
        };
      })
      .sort((a, b) => b.cantidad - a.cantidad);
  }
}
