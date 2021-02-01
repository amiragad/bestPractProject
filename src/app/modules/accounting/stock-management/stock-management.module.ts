import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockManagementComponent } from './stock-management.component';
import { StockTransactionComponent } from './stock-transaction/components/stock-transaction.component';
import { StockBalanceComponent } from './stock-transaction/components/stock-balance/stock-balance.component';
import { StockIncomeComponent } from './stock-transaction/components/stock-income/stock-income.component';
import { StockOutcomeComponent } from './stock-transaction/components/stock-outcome/stock-outcome.component';
import { StockIncomeListComponent } from './stock-transaction/components/stock-income-list/stock-income-list.component';
import { StockInventoryComponent } from './stock-inventory/components/stock-inventory.component';
import { StockInventoryListComponent } from './stock-inventory/components/stock-inventory-list/stock-inventory-list.component';
import { SideBarStockComponent } from './shared/side-bar-stock/side-bar-stock.component';
import { AddComponent } from './stock-inventory/components/add/add.component';
import { ViewComponent } from './stock-inventory/components/view/view.component';
import { StockManagementRoutingModule } from './stock-management-routing';
import { SharedModule } from '../../../shared/shared.module';
import { LookupsModule } from '../lookups/lookups.module';
import { LookupsRoutingModule } from '../lookups/lookups-routing';
import { StockDashboardComponent } from './stock-dashboard/stock-dashboard.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddOpeningBalanceComponent } from './opening-balance/add/add-opening-balance.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { ListOpeningBalanceComponent } from './opening-balance/list/list-opening-balance.component';

@NgModule({
  imports: [
    StockManagementRoutingModule,
    SharedModule
   // LookupsModule,
    //LookupsRoutingModule
  ],
  declarations: [
    StockDashboardComponent,
    StockManagementComponent,
    StockTransactionComponent,
    StockBalanceComponent,
    StockIncomeComponent,
    StockOutcomeComponent,
    StockIncomeListComponent,
    StockInventoryComponent,
    StockInventoryListComponent,
    //SideBarStockComponent,
    AddComponent,
    ViewComponent,
    StockDashboardComponent,
    OpeningBalanceComponent,
    ListOpeningBalanceComponent,
    AddOpeningBalanceComponent
  ]
})
export class StockManagementModule { }
