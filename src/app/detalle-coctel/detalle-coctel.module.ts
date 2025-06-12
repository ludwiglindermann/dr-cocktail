import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCoctelPageRoutingModule } from './detalle-coctel-routing.module';

import { DetalleCoctelPage } from './detalle-coctel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCoctelPageRoutingModule
  ],
  declarations: [DetalleCoctelPage]
})
export class DetalleCoctelPageModule {}
