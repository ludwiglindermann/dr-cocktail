import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  async ingresar() {
    if (!this.usuario || !this.contrasena) {
      await this.mostrarAlerta('Debes ingresar usuario y contraseña.');
      return;
    }

    // Verifica contra admin o contra usuarios registrados
if (this.usuario === 'admin' && this.contrasena === '1234') {
  const usuarioAdmin = {
    usuario: 'admin',
    correo: 'admin@correo.cl'
  };
  localStorage.setItem('usuarioActual', JSON.stringify(usuarioAdmin));
  this.router.navigate(['/home']);
  return;
}

const usuariosGuardados = localStorage.getItem('usuarios');
const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

const usuarioValido = usuarios.find(
  (u: any) => u.usuario === this.usuario && u.contrasena === this.contrasena
);

if (usuarioValido) {
  localStorage.setItem('usuarioActual', JSON.stringify(usuarioValido));
  this.router.navigate(['/home']);
} else {
  await this.mostrarAlerta('Usuario o contraseña incorrectos.');
}


  }

  async mostrarAlerta(mensaje: string) {
    const alerta = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alerta.present();
  }
  irARegistro() {
  this.router.navigate(['/registro']);
}

}
