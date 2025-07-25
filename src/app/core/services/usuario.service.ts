import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
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
  private apiUrl = 'http://localhost:3000/usuarios'; // Cambia a tu URL real

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }
}
