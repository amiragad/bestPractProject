import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesPermissionComponent } from './purchases-permission.component';
import { PurchasesPermissionRecieveComponent } from './components/purchases-permission-recieve/purchases-permission-recieve.component';
import { PurchasesPermissionAddComponent } from './components/purchases-permission-add/purchases-permission-add.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PurchasesPermissionComponent,PurchasesPermissionAddComponent
    ,PurchasesPermissionRecieveComponent]
})
export class PurchasesPermissionModule { }
