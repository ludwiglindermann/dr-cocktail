import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  usuario: string = '';
  contrasena: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storage: Storage
  ) {}

  async ingresar() {
    if (!this.usuario || !this.contrasena) {
      await this.mostrarAlerta('Debes ingresar usuario y contraseña.');
      return;
    }

    // Caso especial admin
    if (this.usuario === 'admin' && this.contrasena === '1234') {
      const usuarioAdmin = {
        usuario: 'admin',
        correo: 'admin@correo.cl'
      };
      await this.storage.set('usuarioActual', usuarioAdmin);
      this.router.navigate(['/home']);
      return;
    }

    const usuariosGuardados = (await this.storage.get('usuarios')) || [];

    const usuarioValido = usuariosGuardados.find(
      (u: any) => u.usuario === this.usuario && u.contrasena === this.contrasena
    );

    if (usuarioValido) {
      await this.storage.set('usuarioActual', usuarioValido);
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

  async mostrarAcercaDe() {
  const alerta = await this.alertController.create({
    header: 'Acerca de Dr. Cocktail',
    message:
      'Profesor: Miguel Puebla\n' +
      'Alumno: Ludwig Lindermann\n' +
      'Curso: Programación de Aplicaciones Móviles',
    buttons: ['Cerrar']
  });
  await alerta.present();
}
}
