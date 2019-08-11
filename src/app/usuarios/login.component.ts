import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Log in';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      swal('Login', 'Hola ' + this.authService.usuario.user 
      + ' ya estás auntenticado.', 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.user == null
      || this.usuario.password == null) {
      swal('Error Login', 'Username o password vacío', 'error');
    }

    this.authService.login(this.usuario).subscribe(
      res => {
        console.log(res);
        this.authService.guardarUsuario(res.access_token);
        this.authService.guardarToken(res.access_token);
        let usuario = this.authService.usuario;

        this.router.navigate(['/clientes']);
        swal('Login', 'Hola ' + usuario.user + ', has iniciado sesión con éxito!', 'success');
      }, err => {
        if(err.status == 400) {
          swal('Error login', 'Usuario o clave incorrecta', 'error');
        }
      }
    )
  }

}
