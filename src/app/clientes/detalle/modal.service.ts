import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal:boolean = false;
  private _notifyUpload:any = new EventEmitter<any>();

  constructor() { }

  get notifyUpload():EventEmitter<any>{
    return this._notifyUpload;
  }

  abrirModal(){
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
