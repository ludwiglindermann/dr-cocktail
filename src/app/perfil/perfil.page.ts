import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  usuario: string = '';
  correo: string = '';

  ngOnInit() {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
      const datos = JSON.parse(usuarioActual);
      this.usuario = datos.usuario;
      this.correo = datos.correo;
    }
  }
}
