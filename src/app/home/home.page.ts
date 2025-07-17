import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { SQLiteService } from '../services/sqlite.service';
import { ApiCoctelesService } from '../services/api-cocteles.service';
import { Clipboard } from '@capacitor/clipboard';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  cocteles: any[] = [];
  favoritos: any[] = [];
  usuarioActual: string = '';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private sqliteService: SQLiteService,
    private apiCoctelesService: ApiCoctelesService
  ) {}

async copiarIngredientes(coctel: any) {
  const texto = `Ingredientes para ${coctel.nombre}:\n` + coctel.ingredientes.join('\n');
  await Clipboard.write({
    string: texto
  });
  alert('Ingredientes copiados al portapapeles');
}


  async ngOnInit() {
    const datosUsuario = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
    this.usuarioActual = datosUsuario.usuario || '';
    this.favoritos = await this.sqliteService.obtenerFavoritos();

    // Buscar cocteles
    this.buscarCoctelesPorNombres(['mojito', 'daiquiri', 'margarita', 'negroni', 'martini']);
  }

  buscarCoctelesPorNombres(nombres: string[]) {
    nombres.forEach(nombre => {
      this.apiCoctelesService.buscarCocteles(nombre).subscribe(res => {
        const procesados = res.map((drink: any) => ({
          id: drink.idDrink,
          nombre: drink.strDrink,
          imagen: drink.strDrinkThumb,
          ingredientes: this.extraerIngredientes(drink),
          preparacion: drink.strInstructionsES || drink.strInstructions
        }));
        this.cocteles = [...this.cocteles, ...procesados];
      });
    });
  }

  extraerIngredientes(drink: any): string[] {
    const ingredientes: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ing = drink[`strIngredient${i}`];
      const med = drink[`strMeasure${i}`];
      if (ing) {
        ingredientes.push(`${med || ''} ${ing}`.trim());
      }
    }
    return ingredientes;
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
    return this.favoritos.some(f => f.id === coctel.id);
  }

  async toggleFavorito(coctel: any) {
    const index = this.favoritos.findIndex(f => f.id === coctel.id);
    if (index > -1) {
      await this.sqliteService.eliminarFavorito(coctel.id);
      this.favoritos.splice(index, 1);
    } else {
      await this.sqliteService.agregarFavorito(coctel);
      this.favoritos.push(coctel);
    }
  }
}
