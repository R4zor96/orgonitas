import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Usuario {
  nombre: string;
  apellidoPaterno: string; // Usa camelCase que es lo que espera Nest
  apellidoMaterno: string;
  celular: string;
  correo: string;
  password: string;
  rol: 'admin' | 'usuario';
  calle?: string;
  numero?: string;
  colonia?: string;
  cp?: string;
  municipio?: string;
  estado?: string;
  referencias?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'backend-orgonitas.up.railway.app/usuarios'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Asegurar que el rol siempre esté presente
    const body = {
      ...usuario,
      rol: usuario.rol || 'usuario', // Valor por defecto
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
