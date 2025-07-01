import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  registroForm!: FormGroup;   // el formulario reactivo

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // definición de validaciones
    this.registroForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^\S+$/)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      correo: ['', [Validators.required, Validators.email]]
    });
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
