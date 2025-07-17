import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  registroForm!: FormGroup;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^\S+$/)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]],
      foto: ['']
    });
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      const base64Image = `data:image/jpeg;base64,${image.base64String}`;
      this.registroForm.patchValue({ foto: base64Image });
    } catch (error) {
      console.error('Error al tomar foto', error);
    }
  }

  async registrar() {
    if (!this.registroForm.valid) {
      await this.mostrarAlerta('Por favor completa todos los campos correctamente.');
      return;
    }

    const nuevoUsuario = this.registroForm.value;

    let usuarios = await this.storageService.obtenerUsuarios();
    const existe = usuarios.find((u: any) => u.usuario === nuevoUsuario.usuario);

    if (existe) {
      await this.mostrarAlerta('El nombre de usuario ya existe.');
      return;
    }

    await this.storageService.agregarUsuario(nuevoUsuario);
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
