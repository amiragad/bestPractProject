
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';

const PurchasesRoutes: Routes = [
  {
    path: '', component: PurchaseInvoiceComponent, children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'list', component: PurchaseInvoiceListComponent },
        { path: 'add', component: AddPurchaseInvoiceComponent },
        { path: ':id', component: AddPurchaseInvoiceComponent },
        {
          path: 'lookups',
          loadChildren: '../lookups/lookups.module#LookupsModule'
        },
        {
          path: 'purchaseRebate',
          loadChildren: '../purchase-rebate/purchase-rebate.module#PurchaseRebateModule'
        },
        {
          path: 'systemData',
          loadChildren: '../system-data/system-data.module#SystemDataModule'
        },
        {
          path: FullRoutes.SUPPLIER_MODULE,
          loadChildren: '../suppliers/suppliers.module#SuppliersModule'
        },
        {
          path: 'clients',
          loadChildren: '../clients/clients.module#ClientsModule'
        },
        {
        path: FullRoutes.BRANCHES_MODULE,
        loadChildren: '../branches/branches.module#BranchesModule'
      },
        {
          path: 'safeBoxTrans',
          loadChildren: '../safe-box-transaction/safe-box-transaction.module#SafeBoxTransactionModule'
        },
       
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(PurchasesRoutes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule {
}
