import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierAccountComponent } from './components/supplier-account/supplier-account.component';
import { AddSupplierComponent } from './components/add-supplier/add-supplier.component';
import { SupplierBillsComponent } from './components/supplier-bills/supplier-bills.component';
import { SuppliersRoutingModule } from './suppliers-routing';
import { SharedModule } from '../../../shared/shared.module';
import { SuppliersComponent } from './suppliers.component';

@NgModule({
  imports: [
    SharedModule,
    SuppliersRoutingModule
  ],
  declarations: [
    SuppliersComponent,
    
    SupplierAccountComponent,
    AddSupplierComponent,
    SupplierBillsComponent
  ]
})
export class SuppliersModule { }
