import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomersComponent } from './customers.component';
import { SharedModule } from '../../../shared/shared.module';
import { CustomersRoutingModule } from './customers-routing';


@NgModule({
  imports: [
    SharedModule,
    CustomersRoutingModule
  ],
  declarations: [AddCustomerComponent, CustomerListComponent, CustomersComponent]
})
export class CustomersModule { }
