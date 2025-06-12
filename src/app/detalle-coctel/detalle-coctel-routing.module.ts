import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleCoctelPage } from './detalle-coctel.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCoctelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCoctelPageRoutingModule {}
