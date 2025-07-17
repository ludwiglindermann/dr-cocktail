import { Injectable } from '@angular/core';
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
  dbName: string = 'dr_cocktail_db';

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
        false
      );
      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS favoritos (
          id TEXT PRIMARY KEY,
          nombre TEXT,
          imagen TEXT,
          data TEXT
        )
      `);
      console.log('✔ SQLite inicializado');
    } catch (error) {
      console.error('❌ Error SQLite:', error);
    }
  }

  async agregarFavorito(coctel: any): Promise<void> {
    if (!this.db) return;
    const data = JSON.stringify(coctel);
    await this.db.run(
      `INSERT OR REPLACE INTO favoritos (id, nombre, imagen, data) VALUES (?, ?, ?, ?)`,
      [coctel.id, coctel.nombre, coctel.imagen, data]
    );
  }

  async obtenerFavoritos(): Promise<any[]> {
    if (!this.db) return [];
    const res = await this.db.query('SELECT * FROM favoritos');
    return (res.values ?? []).map(f => JSON.parse(f.data));
  }

  async eliminarFavorito(id: string): Promise<void> {
    if (!this.db) return;
    await this.db.run('DELETE FROM favoritos WHERE id = ?', [id]);
  }
}
