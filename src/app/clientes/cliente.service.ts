import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, flatMap, toArray } from 'rxjs/operators';

@Injectable()
export class ClienteService {
  private urlEndPoints: string = 'http://localhost:8080/api-cliente/clientes';
  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);

    return this.http.get<Cliente[]>(this.urlEndPoints, { headers: this.headers })
      .pipe(
        map(response => response as Cliente[])
      );
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoints, cliente, { headers: this.headers });
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoints}/${id}`, { headers: this.headers })
      .pipe(
        map(response => response as Cliente)
      )
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoints}/${cliente.id}`, cliente, { headers: this.headers })
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoints}/${id}`, { headers: this.headers })
  }
}
