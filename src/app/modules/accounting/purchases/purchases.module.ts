import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesRoutingModule } from './purchases-routing';
import { SharedModule } from '../../../shared/shared.module';
import { PurchaseInvoiceListComponent } from './component/list/list.component';
import { AddPurchaseInvoiceComponent } from './component/add/add.component';
import { PurchaseInvoiceComponent } from './component/purchase-invoice.component';
import { SideBarPurchasesComponent } from './sharedComponent/side-bar-purchases/side-bar-purchases.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

@NgModule({
  imports: [
    SharedModule,
    PurchasesRoutingModule
    
  ],
  declarations: [
    PurchaseInvoiceComponent,
    PurchaseInvoiceListComponent,
    AddPurchaseInvoiceComponent,
    SideBarPurchasesComponent,
    DashboardComponent
  ]
})
export class PurchasesModule { }
