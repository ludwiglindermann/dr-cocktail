import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SQLiteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private sqliteService: SQLiteService
  ) {
    this.initApp();
  }

  async initApp() {
    await this.storage.create();
    await this.sqliteService.initDB();
  }
}
