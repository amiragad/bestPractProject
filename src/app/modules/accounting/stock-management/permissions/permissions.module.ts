import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddOutputPermissionComponent } from './outPutPermission/components/add-output-permission/add-output-permission.component';
import { PermissionsRoutingModule } from './permissions.router';
import { SharedModule } from '../../../../shared/shared.module';
import { PermissionService } from './outPutPermission/shared/services/permission.service';
import { AddPermissionListComponent } from './outPutPermission/components/add-permission-list/add-permission-list.component';
import { InputPermissionService } from './inPutPermission/shared/services/input-permission.service';
import { AddInputPermissionComponent } from './inPutPermission/components/add-input-permission/add-input-permission.component';
import { AddInputPermissionListComponent } from './inPutPermission/components/add-input-permission-list/add-input-permission-list.component';

@NgModule({
  imports: [
    SharedModule,
    PermissionsRoutingModule
  ],
  declarations: [AddOutputPermissionComponent, AddPermissionListComponent, AddInputPermissionComponent, AddInputPermissionListComponent],
  providers:[PermissionService,InputPermissionService]
})
export class PermissionsModule { }
