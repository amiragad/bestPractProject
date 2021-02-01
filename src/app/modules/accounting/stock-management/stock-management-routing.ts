import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StockBalanceComponent} from './stock-transaction/components/stock-balance/stock-balance.component';
import {StockManagementComponent} from './stock-management.component';
import {StockInventoryComponent} from './stock-inventory/components/stock-inventory.component';
import {ViewComponent} from './stock-inventory/components/view/view.component';
import {StockInventoryListComponent} from './stock-inventory/components/stock-inventory-list/stock-inventory-list.component';
import {AddComponent} from './stock-inventory/components/add/add.component';
import {StockOutcomeComponent} from './stock-transaction/components/stock-outcome/stock-outcome.component';
import {StockIncomeListComponent} from './stock-transaction/components/stock-income-list/stock-income-list.component';
import {StockIncomeComponent} from './stock-transaction/components/stock-income/stock-income.component';
import {StockDashboardComponent} from "./stock-dashboard/stock-dashboard.component";
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';
import { ListOpeningBalanceComponent } from './opening-balance/list/list-opening-balance.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { AddOpeningBalanceComponent } from './opening-balance/add/add-opening-balance.component';

const stockManagementRoutes: Routes = [
  {
     path: '' ,component:StockManagementComponent, children:[
        { path: 'stockInvList',  component: StockInventoryComponent,
        children:[
         { path: '', component: StockInventoryListComponent},
         { path: 'view', component: ViewComponent}
        ]},
        { path:FullRoutes.OPENING_BALANCE, component: OpeningBalanceComponent, children:[
          { path: '', pathMatch: 'full', redirectTo: FullRoutes.OPENING_BALANCE_LIST},
          { path: FullRoutes.OPENING_BALANCE_LIST, component: ListOpeningBalanceComponent},
          { path: FullRoutes.ADD_OPENING_BALANCE, component: AddOpeningBalanceComponent},
          { path: FullRoutes.EDIT_OPENING_BALANCE +'/:id', component: AddOpeningBalanceComponent },
          ]
        },
        {path: 'dashboard', component: StockDashboardComponent},
         { path: 'add', component: AddComponent},
         { path: 'balance', component: StockBalanceComponent},
         { path: 'outcome', component: StockOutcomeComponent},
         { path: 'income',
         children:[
          { path: '', component: StockIncomeListComponent},
          { path: 'view', component: StockIncomeComponent}
         ]
        },
        {
          path: 'lookups',
          loadChildren: '../lookups/lookups.module#LookupsModule'
        },
        {
          path: 'systemData',
          loadChildren: '../system-data/system-data.module#SystemDataModule'
        },


        {
          path: FullRoutes.BRANCHES_MODULE,
          loadChildren: '../branches/branches.module#BranchesModule'
        },
        {
          path: FullRoutes.PRICE_LIST_MODULE,
          loadChildren: '../pricing-list/pricing-list.module#PricingListModule'
        },
        {
          path: 'safeBoxTrans',
          loadChildren: '../safe-box-transaction/safe-box-transaction.module#SafeBoxTransactionModule'
        },
        
  {
    path: 'permissions',
    loadChildren: './permissions/permissions.module#PermissionsModule'
  },
        /* ,
        {
          path: 'main', component: HomeViewsComponent, children: [
            {path: '', pathMatch: 'full', redirectTo: 'suppliers'},
            {
              path: 'suppliers', component: SuppliersComponent, children: [
                {path: '', pathMatch: 'full', redirectTo: 'supplier-accounts'},
                {path: 'supplier-accounts', component: SupplierAccountsComponent},
                {path: 'supplier-account', component: SupplierAccountComponent},
                {path: 'add-supplier', component: AddSupplierComponent},
                {path: 'supplier-bills', component: SupplierBillsComponent}
      
      
              ]
            },
            {
              path: 'purchase-invoice', component: PurchaseInvoiceComponent, children: [
                {path: '', pathMatch: 'full', redirectTo: 'list'},
                {path: 'list', component: PurchaseInvoiceListComponent},
                {path: 'add', component: AddPurchaseInvoiceComponent}
                ,
                {path: 'basic-data', component: SupplierAccountsComponent}
              ]
            }]
        } */
      ]}
  

];

@NgModule({
  imports: [RouterModule.forChild(stockManagementRoutes)],
  exports: [RouterModule]
})
export class StockManagementRoutingModule {
}
