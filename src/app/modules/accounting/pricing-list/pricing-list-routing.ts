
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';
import { PriceListComponent } from './components/price-list.component';
import { PriceListListComponent } from './components/price-list-list/price-list-list.component';
import { AddPriceListComponent } from './components/add-price-list/add-price-list.component';

const PricingListRoutes: Routes = [
  {
     path: '' ,component
     :PriceListComponent,
      children: [
        { path:FullRoutes.PRICE_LIST_LIST, component: PriceListListComponent },
        { path:FullRoutes.ADD_PRICE_LIST , component: AddPriceListComponent },
        { path: FullRoutes.ADD_PRICE_LIST +'/:id', component: AddPriceListComponent }
    ]} 
];

@NgModule({
  imports: [RouterModule.forChild(PricingListRoutes)],
  exports: [RouterModule]
})
export class PricingListRoutingModule {
}
