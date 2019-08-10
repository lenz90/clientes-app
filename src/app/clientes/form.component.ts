import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region'
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  private cliente: Cliente = new Cliente();
  regiones: Region[];
  private titulo: string = "Crear Cliente"
  private errors: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
    this.cargarRegiones();
  }

  public cargarRegiones() {
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        );
      }
    })
  }

  public create(): void {
    console.log(this.cliente);
    this.clienteService.createCliente(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito`, 'success')
      }, err => {
        this.errors = err.error as string[];
        console.error('Codigo de error desde el backend: ' + err.status);
        console.error(err.error);
      }
    )
  }

  public update(): void {
    this.clienteService.updateCliente(this.cliente)
      .subscribe(cliente => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con éxito`, 'success');
      }, err => {
        this.errors = err.error as string[];
        console.error('Codigo de error desde el backend: ' + err.status);
        console.error(err.error);
      })
  }

  public compararRegion(o1: Region, o2: Region) {
    if(o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined
    || o2 === undefined ? false : o1.id === o2.id;
  }
}
