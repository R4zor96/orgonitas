import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Usuario {
  id_usuario?: number;
  nombre: string;
  apellidoPaterno: string;
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
  private apiUrl = 'https://backend-orgonitas.up.railway.app/usuarios'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, {
      ...usuario,
      rol: usuario.rol || 'usuario',
    });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  login(correo: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, {
      correo,
      password,
    });
  }
}
