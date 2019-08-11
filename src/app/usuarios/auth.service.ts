import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _tocken: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && null != sessionStorage.getItem('usuario')) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._tocken != null) {
      return this._tocken;
    } else if (this._tocken == null && sessionStorage.getItem('token') != null) {
      this._tocken = sessionStorage.getItem('token');
      return this._tocken;
    }
    return null;

  }

  login(usuario: Usuario): Observable<any> {
    const urlEndPoint = 'http://localhost:8080/oauth/token';
    const credeciales = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credeciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.user);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });

  }

  guardarToken(accessToken: string): void {
    this._tocken = accessToken;
    sessionStorage.setItem('token', this._tocken);
  }
  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.name = payload.name;
    this._usuario.lastname = payload.lastname;
    this._usuario.email = payload.email;
    this._usuario.user = payload.user_name;
    this._usuario.role = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (null != payload
      && payload.user_name
      && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if(this.usuario.role.includes(role)) {
      return true;
    }
    return false;
  }

  logout() {
    this._tocken = null;
    this._usuario = null;
    sessionStorage.clear();
  }
}
