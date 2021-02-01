import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
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
import { LookupsRoutingModule } from './lookups-routing';
import { LookupDetailsComponent } from './lookup-details/lookup-details.component';
import { LookupListComponent } from './lookup-list/lookup-list.component';
import { LookupService } from './shared/services/lookup-service.service';
import { AccountingChartComponent } from './accounting-chart/accounting-chart.component';

@NgModule({
  providers:[LookupService],
  imports: [
    SharedModule,
    LookupsRoutingModule,
    
  ],
  declarations: [
    MeasruingUnitComponent,
    MeasruingUnitListComponent,
    ProductNaturityComponent,
    ProductNaturityListComponent,
    CountryComponent,
    CountryListComponent,
    CityComponent,
    CityListComponent,
    AreaComponent,
    AreaListComponent,
    CurrencyComponent,
    CurrencyListComponent,
    LookupDetailsComponent,
    LookupListComponent,
    AccountingChartComponent
  ],
  exports:[
    MeasruingUnitComponent,
    MeasruingUnitListComponent,
    ProductNaturityComponent,
    ProductNaturityListComponent,
    CountryComponent,
    CountryListComponent,
    CityComponent,
    CityListComponent,
    AreaComponent,
    AreaListComponent,
    CurrencyComponent,
    CurrencyListComponent,
    LookupDetailsComponent,
    LookupListComponent
  ]
})
export class LookupsModule { }
