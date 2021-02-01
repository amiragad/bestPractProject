
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddOutputPermissionComponent } from './outPutPermission/components/add-output-permission/add-output-permission.component';
import { AddPermissionListComponent } from './outPutPermission/components/add-permission-list/add-permission-list.component';
import { AddInputPermissionComponent } from './inPutPermission/components/add-input-permission/add-input-permission.component';
import { AddInputPermissionListComponent } from './inPutPermission/components/add-input-permission-list/add-input-permission-list.component';

const PermissionsRoutes: Routes = [
    {
        path: '',  children: [
                {
                  path: 'add-output-permission', component: AddOutputPermissionComponent
                },
                {
                  path: 'list-output-permission', component: AddPermissionListComponent
                },
                {
                  path: 'add-Input-permission', component: AddInputPermissionComponent
                },
                {
                  path: 'list-Input-permission', component: AddInputPermissionListComponent
                }
              ]
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(PermissionsRoutes)],
    exports: [RouterModule]
})
export class PermissionsRoutingModule {
}
