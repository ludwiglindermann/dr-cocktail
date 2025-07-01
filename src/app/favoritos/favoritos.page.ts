import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];
  usuarioActual: string = '';

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    const usuarioData = localStorage.getItem('usuarioActual');
    if (usuarioData) {
      const datos = JSON.parse(usuarioData);
      this.usuarioActual = datos.usuario;
    }

    this.favoritos = await this.storageService.obtenerFavoritos(this.usuarioActual);
  }

  // función para volver al home
  volver() {
    this.router.navigate(['/home']);
  }
}
