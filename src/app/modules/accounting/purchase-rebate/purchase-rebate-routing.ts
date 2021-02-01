
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { PurchaseRebateComponent } from './component/purchase-rebate.component';
import { PurchaseRebateListComponent } from './component/list/list.component';
import { PurchaseRebateEditorComponent } from './component/add/add.component';

const PurchasesRebateRoutes: Routes = [
  {
    path: '', component: PurchaseRebateComponent, children: [
        { path: '', pathMatch: 'full', redirectTo: 'list' },
        { path: 'list', component: PurchaseRebateListComponent },
        { path: 'add', component: PurchaseRebateEditorComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(PurchasesRebateRoutes)],
  exports: [RouterModule]
})
export class PurchasesRebateRoutingModule {
}
