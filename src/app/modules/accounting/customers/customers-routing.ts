
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';
import { CustomersComponent } from './customers.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';

const customersRoutes: Routes = [
  {
     path: '' ,component:CustomersComponent,
      children: [
        { path:FullRoutes.CUSTOMER_LIST, component: CustomerListComponent },
        { path:FullRoutes.ADD_CUSTOMER , component: AddCustomerComponent },
        { path: FullRoutes.ADD_CUSTOMER +'/:id', component: AddCustomerComponent }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(customersRoutes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {
}
