import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { clientAccountsComponent } from './components/client-accounts/client-accounts.component';
import { AddclientComponent } from './components/add-client/add-client.component';
import { clientBillsComponent } from './components/client-bills/client-bills.component';
import { ClientsRoutingModule } from './clients-routing';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    ClientsRoutingModule,
    SharedModule
  ],
  declarations: [
    clientAccountsComponent,
    AddclientComponent,
    clientBillsComponent
  ]
})
export class ClientsModule { }
