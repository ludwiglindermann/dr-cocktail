import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SQLiteService } from '../services/sqlite.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];

  constructor(
    private sqliteService: SQLiteService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.favoritos = await this.sqliteService.obtenerFavoritos();
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
