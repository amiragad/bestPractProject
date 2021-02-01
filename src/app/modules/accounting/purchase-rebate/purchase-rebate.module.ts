import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseRebateListComponent } from './component/list/list.component';
import { PurchaseRebateEditorComponent } from './component/add/add.component';
import { PurchaseRebateComponent } from './component/purchase-rebate.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PurchaseRebateListComponent,PurchaseRebateEditorComponent,
    PurchaseRebateComponent]
})
export class PurchaseRebateModule { }
