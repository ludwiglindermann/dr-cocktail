import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage {
  usuario: any = null; // almacena todo el objeto del usuario actual

  constructor(private storage: Storage, private router: Router) {}

  async ionViewWillEnter() {
    // cuando se entra a la vista, recupera el usuario desde Storage
    this.usuario = await this.storage.get('usuarioActual');
  }

  cerrarSesion() {
    // elimina usuario y redirige a login
    this.storage.remove('usuarioActual');
    this.router.navigate(['/login']);
  }
}
