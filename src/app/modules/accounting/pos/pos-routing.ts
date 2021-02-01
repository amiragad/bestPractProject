
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';
import { positionElements } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { PosListComponent } from './components/pos-list/pos-list.component';
import { PosComponent } from './pos.component';

const POSRoutes: Routes = [
  {
     path: '' ,component:PosComponent,
      children: [
        { path: 'list', component: PosListComponent }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(POSRoutes)],
  exports: [RouterModule]
})
export class POSRoutingModule {
}
