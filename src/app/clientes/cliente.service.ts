import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, flatMap, toArray } from 'rxjs/operators';

@Injectable()
export class ClienteService {
 private urlEndPoints:string = 'http://localhost:8080/api-cliente/clientes';
  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]>{
    //return of(CLIENTES);

    let headers = new HttpHeaders();
          headers.append('Content-Type', 'application/json');


    return this.http.get<Cliente[]>(this.urlEndPoints,{headers:headers}).pipe(
      map(response=>response as Cliente[])
    );
  }

}
