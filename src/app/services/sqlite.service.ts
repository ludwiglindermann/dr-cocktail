import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  sqlite: SQLiteConnection;
  db: SQLiteDBConnection | null = null;
  dbName: string = 'dr_cocktail_db';  // Agregamos esto

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDB(): Promise<void> {
    try {
      this.db = await this.sqlite.createConnection(
        this.dbName,
        false,
        'no-encryption',
        1,
        false // nuevo parámetro
      );
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS favoritos (
          id TEXT PRIMARY KEY,
          nombre TEXT,
          imagen TEXT
        )
      `);
      console.log('Base de datos SQLite lista');
    } catch (error) {
      console.error('Error al inicializar SQLite:', error);
    }
  }

  async agregarFavorito(coctel: any): Promise<void> {
    if (!this.db) return;
    const stmt = `INSERT OR REPLACE INTO favoritos (id, nombre, imagen) VALUES (?, ?, ?)`;
    await this.db.run(stmt, [coctel.id, coctel.nombre, coctel.imagen]);
  }

  async obtenerFavoritos(): Promise<any[]> {
    if (!this.db) return [];
    const res = await this.db.query('SELECT * FROM favoritos');
    return res.values ?? [];
  }

  async eliminarFavorito(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.run('DELETE FROM favoritos WHERE id = ?', [id]);
  }

  async cerrarConexion(): Promise<void> {
    if (this.db) {
      await this.sqlite.closeConnection(this.dbName, false); // nuevo formato
      this.db = null;
    }
  }
}
