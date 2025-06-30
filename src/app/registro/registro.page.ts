import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';  // importamos nuestro servicio

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false, // trabajamos con NgModules
})
export class RegistroPage {
  // variables para capturar datos del formulario
  nuevoUsuario: string = '';
  nuevaContrasena: string = '';
  nuevoCorreo: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService  // inyectamos el servicio
  ) {}

  // método registrar que se ejecuta al presionar el botón de registro
  async registrar() {
    if (!this.nuevoUsuario || !this.nuevaContrasena || !this.nuevoCorreo) {
      await this.mostrarAlerta('Debes ingresar usuario, contraseña y correo.');
      return;
    }

    // recuperamos usuarios previamente almacenados
    let usuarios = await this.storageService.obtenerUsuarios();

    // verificamos si ya existe el usuario
    const existe = usuarios.find((u: any) => u.usuario === this.nuevoUsuario);
    if (existe) {
      await this.mostrarAlerta('El nombre de usuario ya existe.');
      return;
    }

    // agregamos el nuevo usuario
    await this.storageService.agregarUsuario({
      usuario: this.nuevoUsuario,
      contrasena: this.nuevaContrasena,
      correo: this.nuevoCorreo
    });

    // confirmamos y redirigimos
    await this.mostrarAlerta('¡Usuario registrado con éxito!');
    this.router.navigate(['/login']);
  }

  // alertas reutilizables
  async mostrarAlerta(mensaje: string) {
    const alerta = await this.alertController.create({
      header: 'Registro',
      message: mensaje,
      buttons: ['OK']
    });
    await alerta.present();
  }
}
