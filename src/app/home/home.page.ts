import { Component, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { SQLiteService } from '../services/sqlite.service';
import { ApiCoctelesService } from '../services/api-cocteles.service';
import { Clipboard } from '@capacitor/clipboard';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  @ViewChildren('cardRef', { read: ElementRef }) tarjetas!: QueryList<ElementRef>;

  cocteles: any[] = [];
  favoritos: any[] = [];
  usuarioActual: string = '';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private sqliteService: SQLiteService,
    private apiCoctelesService: ApiCoctelesService,
    private animationCtrl: AnimationController
  ) {}

  ngAfterViewInit() {
    // Nada aquí, porque las tarjetas no existen aún
  }

async ngOnInit() {
  const datosUsuario = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  this.usuarioActual = datosUsuario.usuario || '';
  this.favoritos = await this.sqliteService.obtenerFavoritos();

  await this.buscarCoctelesPorNombres(['mojito', 'daiquiri', 'martini']);
  setTimeout(() => this.animarTarjetas(), 500);
}

async buscarCoctelesPorNombres(nombres: string[]) {
  const peticiones = nombres.map(nombre =>
    this.apiCoctelesService.buscarCocteles(nombre).toPromise()
  );

  const respuestas = await Promise.all(peticiones);

  respuestas.forEach(res => {
    if (res && Array.isArray(res)) {
      const nuevos = res.map((drink: any) => ({
        id: drink.idDrink,
        nombre: drink.strDrink,
        imagen: drink.strDrinkThumb,
        ingredientes: this.extraerIngredientes(drink),
        preparacion: drink.strInstructionsES || drink.strInstructions
      }));
      this.cocteles = [...this.cocteles, ...nuevos];
    }
  });
}


  animarTarjetas() {
    if (!this.tarjetas || this.tarjetas.length === 0) return;

    this.tarjetas.forEach((tarjeta, index) => {
      this.animationCtrl
        .create()
        .addElement(tarjeta.nativeElement)
        .duration(1000)
        .delay(index * 200)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(40px)', 'translateY(0)')
        .easing('ease-out')
        .play();
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
    this.router.navigate(['/detalle-coctel'], { state: { coctel } });
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


  async copiarIngredientes(coctel: any) {
    const texto = `Ingredientes para ${coctel.nombre}:\n` + coctel.ingredientes.join('\n');
    await Clipboard.write({ string: texto });
    alert('Ingredientes copiados al portapapeles');
  }
}
