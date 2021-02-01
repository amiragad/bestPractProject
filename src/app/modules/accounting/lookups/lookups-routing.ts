
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { MeasruingUnitComponent } from './measruing-unit/components/measruing-unit.component';
import { MeasruingUnitListComponent } from './measruing-unit/components/measruing-unit-list/measruing-unit-list.component';
import { ProductNaturityComponent } from './product-naturity/components/product-naturity.component';
import { ProductNaturityListComponent } from './product-naturity/components/product-naturity-list/product-naturity-list.component';
import { CountryComponent } from './country/components/country.component';
import { CountryListComponent } from './country/components/country-list/country-list.component';
import { CityComponent } from './city/components/city.component';
import { CityListComponent } from './city/components/city-list/city-list.component';
import { AreaComponent } from './area/components/area.component';
import { AreaListComponent } from './area/components/area-list/area-list.component';
import { CurrencyComponent } from './currency/components/currency.component';
import { CurrencyListComponent } from './currency/components/currency-list/currency-list.component';
import { LookupListComponent } from './lookup-list/lookup-list.component';
import { LookupDetailsComponent } from './lookup-details/lookup-details.component';
import { AccountingChartComponent } from './accounting-chart/accounting-chart.component';

const lookupsRoutes: Routes = [
    {
        path: '',  children: [
                {
                  path: 'measruingUnit', component: MeasruingUnitComponent,
                  children: [
                    { path: '', component: MeasruingUnitListComponent }
                  ]
                },
                {
                  path: 'productNaturity', component: ProductNaturityComponent,
                  children: [
                    { path: '', component: ProductNaturityListComponent }
                  ]
                },
                {
                  path: 'country', component: CountryComponent,
                  children: [
                    { path: '', component: CountryListComponent }
                  ]
                },
                {
                  path: 'city', component: CityComponent,
                  children: [
                    { path: '', component: CityListComponent }
                  ]
                },
                {
                  path: 'chart', component: AccountingChartComponent,
                  children: [
                    { path: '', component: AccountingChartComponent }
                  ]
                },
                {
                  path: 'currency', component: CurrencyComponent,
                  children: [
                    { path: '', component: CurrencyListComponent }
                  ]
                },
                {
                  path: 'lookup', component: LookupListComponent,
                      }
                ,
                {
                  path: 'details', component: LookupDetailsComponent,
                }
              ]
        
    }
];

@NgModule({
    imports: [RouterModule.forChild(lookupsRoutes)],
    exports: [RouterModule]
})
export class LookupsRoutingModule {
}
