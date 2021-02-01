import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PricingListRoutingModule } from './pricing-list-routing';
import { AddPriceListComponent } from './components/add-price-list/add-price-list.component';
import { PriceListListComponent } from './components/price-list-list/price-list-list.component';
import { PriceListComponent } from './components/price-list.component';

@NgModule({
  imports: [
    SharedModule,
    PricingListRoutingModule
  ],
  declarations: [PriceListComponent, AddPriceListComponent, PriceListListComponent]
})
export class PricingListModule { }
