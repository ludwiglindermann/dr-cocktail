import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  nuevoUsuario: string = '';
  nuevaContrasena: string = '';
  nuevoCorreo: string = ''; // <-- AGREGADO

  constructor(private router: Router, private alertController: AlertController) {}

  async registrar() {
    if (!this.nuevoUsuario || !this.nuevaContrasena || !this.nuevoCorreo) {
      await this.mostrarAlerta('Debes ingresar usuario, contraseña y correo.');
      return;
    }

    const usuariosGuardados = localStorage.getItem('usuarios');
    const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    const existe = usuarios.find((u: any) => u.usuario === this.nuevoUsuario);
    if (existe) {
      await this.mostrarAlerta('El nombre de usuario ya existe.');
      return;
    }

    usuarios.push({
      usuario: this.nuevoUsuario,
      contrasena: this.nuevaContrasena,
      correo: this.nuevoCorreo // <-- AGREGADO
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    await this.mostrarAlerta('¡Usuario registrado con éxito!');
    this.router.navigate(['/login']);
  }
  async mostrarAlerta(mensaje: string) {
  const alerta = await this.alertController.create({
    header: 'Registro',
    message: mensaje,
    buttons: ['OK']
  });
  await alerta.present();
}
}

