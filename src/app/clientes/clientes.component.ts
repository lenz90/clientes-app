import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from "./cliente.service";
import { ModalService } from './detalle/modal.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginator: any;
  clienteSeleccionado:Cliente;

  constructor(private clienteService: ClienteService,
    private modalService:ModalService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginator = response;
        }
      );
    });

    this.modalService.notifyUpload.subscribe(cliente=>{
      this.clientes = this.clientes.map(clienteOriginal=>{
        if(cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })

    swalWithBootstrapButtons({
      title: 'Estás seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.deleteCliente(cliente.id)
          .subscribe(response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swalWithBootstrapButtons(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success');
          })
      }
    })
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
