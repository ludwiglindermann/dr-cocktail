import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-coctel',
  templateUrl: './detalle-coctel.page.html',
  styleUrls: ['./detalle-coctel.page.scss'],
  standalone: false,
})
export class DetalleCoctelPage {
  coctel: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.coctel = nav?.extras?.state?.['coctel'];
  }
}
