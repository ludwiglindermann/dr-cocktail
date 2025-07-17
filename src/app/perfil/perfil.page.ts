import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  usuarioActual: any = {
    usuario: '',
    correo: '',
    foto: ''
  };

  constructor(private storage: Storage, private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.storage.create(); // Asegura que storage esté listo

    const datos = await this.storage.get('usuarioActual');

    if (datos?.usuario) {
      this.usuarioActual = datos;
    } else {
      console.warn('No se encontró el usuario actual en storage.');
    }
  }

  async actualizarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      const nuevaFoto = `data:image/jpeg;base64,${image.base64String}`;
      this.usuarioActual.foto = nuevaFoto;

      // Actualizar storage
      const usuarios = (await this.storage.get('usuarios')) || [];

      const index = usuarios.findIndex((u: any) => u.usuario === this.usuarioActual.usuario);

      if (index >= 0) {
        usuarios[index].foto = nuevaFoto;
        await this.storage.set('usuarios', usuarios);
      }

      await this.storage.set('usuarioActual', this.usuarioActual);
    } catch (error) {
      console.error('Error al actualizar la foto', error);
    }
  }
}
