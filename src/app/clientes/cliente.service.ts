import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common'
//import { CLIENTES } from './clientes.json';
import localeES from '@angular/common/locales/es-PE';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import {Region} from './region';

@Injectable()
export class ClienteService {
  private urlEndPoints: string = 'http://localhost:8080/api-cliente/clientes';
  private regionEndPoints: string = 'http://localhost:8080/api-regiones';
  constructor(private http: HttpClient, private router: Router) { }

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });


  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.regionEndPoints + '/regiones');
  }

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);

    return this.http.get(this.urlEndPoints + '/page/' + page, { headers: this.headers })
      .pipe(
        tap((response: any) => {
          (response.content as Cliente[]).forEach(
            c => console.log(c.nombre)
          )
        }),
        map((response: any) => {
          (response.content as Cliente[]).map(c => {
            c.nombre = c.nombre.toUpperCase();
            //let datePipe = new DatePipe('es-PE')
            //c.createAt = datePipe.transform(c.createAt,'EEEE dd, MMMM yyyy')
            //c.createAt = formatDate(c.createAt, 'dd-MM-yyyy HH:mm:SS', 'en-US' )
            return c;
          });

          return response;
        }));
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoints, cliente, { headers: this.headers })
      .pipe(
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje)
          swal('Error al guardar.', e.error.mensaje, 'error');
          return throwError(e);
        })
      );;
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoints}/${id}`, { headers: this.headers })
      .pipe(
        map(response => response as Cliente)
      ).pipe(
        catchError(e => {
          this.router.navigate(['/clientes'])
          console.error(e.error.mensaje)
          swal('Error al editar.', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoints}/${cliente.id}`, cliente, { headers: this.headers })
      .pipe(
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }

          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje)
          swal('Error al actualizar.', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoints}/${id}`, { headers: this.headers })
      .pipe(
        catchError(e => {
          console.error(e.error.mensaje)
          swal('Error al eliminar.', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  uploadFoto(archivo: File, id):Observable<HttpEvent<{}>>{
    let formdata = new FormData();
    formdata.append("archivo",archivo);
    formdata.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoints}/upload`, formdata, {
      reportProgress: true
    });

    return this.http.request(req);

  }
}
