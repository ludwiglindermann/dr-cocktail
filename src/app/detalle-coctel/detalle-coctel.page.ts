import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-coctel',
  templateUrl: './detalle-coctel.page.html',
  styleUrls: ['./detalle-coctel.page.scss'],
  standalone: false,
})
export class DetalleCoctelPage {
  coctel: any; // almacena el cóctel seleccionado desde home

  constructor(private router: Router) {
    // al crear la página, obtenemos la navegación con datos extra
    const nav = this.router.getCurrentNavigation();

    // accedemos al objeto que enviamos desde home.state
    this.coctel = nav?.extras?.state?.['coctel'];

    // opcionalmente podrías controlar si viene nulo:
    if (!this.coctel) {
      // por ejemplo volver al home si no hay datos
      this.router.navigate(['/home']);
    }
  }
}
