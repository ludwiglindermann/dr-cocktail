import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private storage: Storage) {
    this.initStorage();
  }

  // inicializa la base de datos cuando parte la app
  async initStorage() {
    await this.storage.create();
    console.log('Storage inicializado correctamente');
  }
}
