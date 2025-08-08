import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Venta {
  id_venta?: number;
  id_usuario: number;
  id_producto: number;
  fecha_pedido: string; // o Date si prefieres
  fecha_entrega: string;
  cantidad: number;
  costo_total: number;
}

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'https://backend-orgonitas.up.railway.app/ventas';

  constructor(private http: HttpClient) {}

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }

  createVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta);
  }

  updateVenta(id: number, venta: Venta): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/${id}`, venta);
  }

  deleteVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos específicos para KPIs
  getVentasPorPeriodo(inicio: string, fin: string): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}?inicio=${inicio}&fin=${fin}`);
  }
}
