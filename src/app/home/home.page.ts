import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  cocteles = [
    {
      nombre: 'Mojito',
      imagen: 'https://cuberspremium.com/wp-content/uploads/2017/07/receta-mojito.jpg',
      ingredientes: [
        '2 oz de ron blanco',
        '1 oz de jugo de limón',
        '2 cucharaditas de azúcar',
        '6 hojas de menta',
        'Agua con gas',
        'Hielo'
      ],
      preparacion: 'Machacar la menta con el azúcar y el limón, añadir hielo, ron y completar con agua con gas.'
    },
    {
      nombre: 'Daiquiri',
      imagen: 'https://assets.bacardicontenthub.com/transform/8178432e-721f-4c42-b075-7392a94434b6/Bacardi_Daiquiri_Headerbanner_Mobile_PBX?io=transform:fit,width:500,height:625&format=jpg&quality=75',
      ingredientes: [
        '2 oz de ron blanco',
        '1 oz de jugo de lima',
        '1/2 oz de jarabe de azúcar'
      ],
      preparacion: 'Agitar todos los ingredientes con hielo y servir colado en una copa de cóctel.'
    },
    {
      nombre: 'Piña Colada',
      imagen: 'https://assets.bacardicontenthub.com/transform/6873626b-8752-4f06-9111-45b918892348/FY22_FR_Bacardi_PinaColada_Cocktail_HeroMobile_2400x3000?io=transform:fit,width:500,height:625&format=jpg&quality=75',
      ingredientes: [
        '2 oz de ron',
        '1 oz de crema de coco',
        '3 oz de jugo de piña',
        'Hielo'
      ],
      preparacion: 'Mezclar todos los ingredientes en la licuadora hasta que quede suave. Servir frío.'
    }
  ];

  favoritos: any[] = [];
  usuarioActual: string = '';

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    // leer usuario actual
    const datosUsuario = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
    this.usuarioActual = datosUsuario.usuario || '';

    // cargar favoritos del usuario actual
    this.favoritos = await this.storageService.obtenerFavoritos(this.usuarioActual);
  }

  verDetalle(coctel: any) {
    this.router.navigate(['/detalle-coctel'], {
      state: { coctel }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('sesion');
    this.router.navigate(['/login']);
  }

  esFavorito(coctel: any): boolean {
    return this.favoritos.some(f => f.nombre === coctel.nombre);
  }

  async toggleFavorito(coctel: any) {
    if (this.esFavorito(coctel)) {
      await this.storageService.eliminarFavorito(this.usuarioActual, coctel.nombre);
    } else {
      await this.storageService.agregarFavorito(this.usuarioActual, coctel);
    }
    this.favoritos = await this.storageService.obtenerFavoritos(this.usuarioActual);
  }
}
