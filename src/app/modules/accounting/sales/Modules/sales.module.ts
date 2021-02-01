import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesInvoiceComponent } from '../Components/sales-invoice/sales-invoice.component';
import { SalesInvoiceListComponent } from '../Components/sales-invoice/list/list.component';
import { AddSalesInvoiceComponent } from '../Components/sales-invoice/add/add.component';
import { SalesRebateComponent } from '../Components/sales-rebate/sales-rebate.component';
import { SalesRebateEditorComponent } from '../Components/sales-rebate/add/add.component';
import { SalesRebateListComponent } from '../Components/sales-rebate/list/list.component';
import { SideBarSalesComponent } from '../side-bar/side-bar-sales.component';
import { SalesComponent } from '../Components/sales.component';
import { SalesRoutingModule } from '../Routers/sales.router.module';
import { SharedModule } from '../../../../shared/shared.module';
import { DashboardComponent } from '../Components/dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SalesRoutingModule
  ],
  declarations: [
    SalesComponent,
    SalesInvoiceComponent,
    SalesInvoiceListComponent,
    AddSalesInvoiceComponent,
    SalesRebateComponent,
    SalesRebateEditorComponent,
    SalesRebateListComponent,
    SideBarSalesComponent,
    DashboardComponent
  ]
})
export class SalesModule { }
