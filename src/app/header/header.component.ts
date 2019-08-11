import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html'
})
export class HeaderComponent{
  title:string = 'App Angular Spring'
  constructor(private authService: AuthService, 
    private router: Router) {

  }

  logout():void{
    let user = this.authService.usuario.name;
    this.authService.logout();
    swal('Logout', 'Hola ' + user + ' has cerrado sesion', 'success');
    this.router.navigate(['/login']);
  }
}


