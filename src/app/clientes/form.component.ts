import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  private cliente: Cliente = new Cliente();
  private titulo: string = "Crear Cliente"

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente()
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
    this.clienteService.createCliente(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito`, 'success')
      }
    )
  }

  public update(): void {
    this.clienteService.updateCliente(this.cliente)
      .subscribe(cliente => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con éxito`, 'success');
      })
  }

}
