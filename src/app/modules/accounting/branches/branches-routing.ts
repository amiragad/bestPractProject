
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';
import { BranchesComponent } from './componentes/branches.component';
import { BranchListComponent } from './componentes/branch-list/branch-list.component';
import { AddBranchComponent } from './componentes/add-branch/add-branch.component';

const BranchesRoutes: Routes = [
  {
     path: '' ,component
     :BranchesComponent,
      children: [
        { path:FullRoutes.BRANCH_LIST, component: BranchListComponent },
        { path:FullRoutes.ADD_BRANCH , component: AddBranchComponent },
        { path: FullRoutes.ADD_BRANCH +'/:id', component: AddBranchComponent }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(BranchesRoutes)],
  exports: [RouterModule]
})
export class BranchesRoutingModule {
}
