
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesInvoiceComponent } from '../Components/sales-invoice/sales-invoice.component';
import { SalesInvoiceListComponent } from '../Components/sales-invoice/list/list.component';
import { AddSalesInvoiceComponent } from '../Components/sales-invoice/add/add.component';
import { SalesRebateComponent } from '../Components/sales-rebate/sales-rebate.component';
import { SalesRebateEditorComponent } from '../Components/sales-rebate/add/add.component';
import { SalesRebateListComponent } from '../Components/sales-rebate/list/list.component';
import { SalesComponent } from '../Components/sales.component';
import { DashboardComponent } from '../Components/dashboard/dashboard.component';
import { FullRoutes } from '../../../../infrastructure/data/enums/angular-full-routes.enum';


const SalesRoutes: Routes = [
  {
    path: '', component: SalesComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'sales-invoice', component: SalesInvoiceComponent, children: [
          { path: '', pathMatch: 'full', redirectTo: 'list' },
          { path: 'list', component: SalesInvoiceListComponent },
          { path: 'add', component: AddSalesInvoiceComponent },
          { path: ':id', component: AddSalesInvoiceComponent },
        ]
      },
      {
        path: 'sales-rebate', component: SalesRebateComponent, children: [
          { path: '', pathMatch: 'full', redirectTo: 'list' },
          { path: 'list', component: SalesRebateListComponent },
          { path: 'add', component: SalesRebateEditorComponent }

        ]
      },
      {
        path: 'lookups',
        loadChildren: '../../lookups/lookups.module#LookupsModule'
      },
      {
        path: FullRoutes.CUSTOMER_MODULE,
        loadChildren: '../../customers/customers.module#CustomersModule'
      },
       
      {
        path: FullRoutes.CONTACT_PERSON_MODULE,
        loadChildren: '../../contact-person/contact-person.module#ContactPersonModule'
      } ,
        {
        path: FullRoutes.BRANCHES_MODULE,
        loadChildren: '../../branches/branches.module#BranchesModule'
      },
      {
        path: 'systemData',
        loadChildren: '../../system-data/system-data.module#SystemDataModule'
      },
      {
        path: 'suppliers',
        loadChildren: '../../suppliers/suppliers.module#SuppliersModule'
      },
      {
        path: 'clients',
        loadChildren: '../../clients/clients.module#ClientsModule'
      },
      {
        path: 'safeBoxTrans',
        loadChildren: '../../safe-box-transaction/safe-box-transaction.module#SafeBoxTransactionModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(SalesRoutes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {
}
