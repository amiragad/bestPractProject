
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';

const PurchasesPermissionRoutes: Routes = [
  {
    path: '', component: PurchaseInvoiceComponent, children: [
        { path: 'list', component: PurchaseInvoiceListComponent },
        { path: 'add', component: AddPurchaseInvoiceComponent },
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(PurchasesPermissionRoutes)],
  exports: [RouterModule]
})
export class PurchasesPermissionRoutingModule {
}
