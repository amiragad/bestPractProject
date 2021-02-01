
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { clientAccountsComponent } from './components/client-accounts/client-accounts.component';
import { AddclientComponent } from './components/add-client/add-client.component';
import { clientBillsComponent } from './components/client-bills/client-bills.component';

const clientsRoutes: Routes = [
  {
     path: '' ,
      children: [
        { path: 'client-accounts', component: clientAccountsComponent },
        { path: 'add-client', component: AddclientComponent },
        { path: 'client-bills', component: clientBillsComponent }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(clientsRoutes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {
}
