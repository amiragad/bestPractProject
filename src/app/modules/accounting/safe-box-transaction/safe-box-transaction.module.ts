import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBoxTransactionAddComponent } from './components/safe-box-transaction-add/safe-box-transaction-add.component';
import { SafeBoxTransactionListComponent } from './components/safe-box-transaction-list/safe-box-transaction-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { SafeBoxTransRoutingModule } from './safe-box-transaction-routing';

@NgModule({
  imports: [
    SharedModule,
    SafeBoxTransRoutingModule
  ],
  declarations: [
    SafeBoxTransactionAddComponent,
     SafeBoxTransactionListComponent
    ]
})
export class SafeBoxTransactionModule { }
