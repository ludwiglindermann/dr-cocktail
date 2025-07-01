import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const store = await this.storage.create();
    this._storage = store;
  }

  // Usuarios (sin cambios)
  async agregarUsuario(nuevoUsuario: any) {
    let usuarios = await this._storage?.get('usuarios');
    if (!usuarios) {
      usuarios = [];
    }
    usuarios.push(nuevoUsuario);
    await this._storage?.set('usuarios', usuarios);
  }

  async obtenerUsuarios(): Promise<any[]> {
    const usuarios = await this._storage?.get('usuarios');
    return usuarios || [];
  }

  async validarUsuario(nombre: string, contrasena: string) {
    const usuarios = await this.obtenerUsuarios();
    return usuarios.find(u => u.usuario === nombre && u.contrasena === contrasena);
  }

  async obtenerUsuario(nombre: string) {
    const usuarios = await this.obtenerUsuarios();
    return usuarios.find(u => u.usuario === nombre);
  }

  // -------------------------------------------------------
  // FAVORITOS POR USUARIO
  // -------------------------------------------------------

  async obtenerFavoritos(usuario: string): Promise<any[]> {
    const favs = await this._storage?.get(`favoritos_${usuario}`);
    return favs || [];
  }

  async agregarFavorito(usuario: string, coctel: any) {
    let favs = await this.obtenerFavoritos(usuario);
    if (!favs.find(f => f.nombre === coctel.nombre)) {
      favs.push(coctel);
      await this._storage?.set(`favoritos_${usuario}`, favs);
    }
  }

  async eliminarFavorito(usuario: string, nombre: string) {
    let favs = await this.obtenerFavoritos(usuario);
    favs = favs.filter(f => f.nombre !== nombre);
    await this._storage?.set(`favoritos_${usuario}`, favs);
  }
}
