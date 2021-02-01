
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafeBoxTransactionListComponent } from './components/safe-box-transaction-list/safe-box-transaction-list.component';
import { SafeBoxTransactionAddComponent } from './components/safe-box-transaction-add/safe-box-transaction-add.component';

const safeBoxTransRoutes: Routes = [
    {
        path: '', children: [
            { path: 'safeBoxTrans', component: SafeBoxTransactionListComponent },
            { path: 'add', component: SafeBoxTransactionAddComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(safeBoxTransRoutes)],
    exports: [RouterModule]
})
export class SafeBoxTransRoutingModule {
}
