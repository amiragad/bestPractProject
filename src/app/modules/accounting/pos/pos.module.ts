import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { POSRoutingModule } from './pos-routing';

import { PosListComponent } from './components/pos-list/pos-list.component';
import { PosComponent } from './pos.component';

@NgModule({
  imports: [
    SharedModule,
    POSRoutingModule
  ],
  declarations: [PosComponent, PosListComponent]
})
export class PosModule { }
