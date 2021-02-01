
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { SupplierAccountComponent } from './components/supplier-account/supplier-account.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';
import { SupplierBillsComponent } from './components/supplier-bills/supplier-bills.component';
import { SuppliersComponent } from './suppliers.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';

const suppliersRoutes: Routes = [
  {
     path: '' ,component:SuppliersComponent,
      children: [
        { path:FullRoutes.SUPPLIER_LIST, component: SupplierAccountComponent },
        { path:FullRoutes.ADD_SUPPLIER , component: AddSupplierComponent },
        { path: FullRoutes.ADD_SUPPLIER +'/:id', component: AddSupplierComponent },
        { path: 'supplier-bills', component: SupplierBillsComponent }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(suppliersRoutes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule {
}
