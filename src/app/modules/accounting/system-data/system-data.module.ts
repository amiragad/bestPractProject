import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemDataRoutingModule } from './system-data-routing';
import { StockListComponent } from './stock/components/stock-list/stock-list.component';
import { StockComponent } from './stock/components/stock.component';
import { SafeBoxComponent } from './safe-box/components/safe-box.component';
import { SafeBoxListComponent } from './safe-box/components/safe-box-list/safe-box-list.component';
import { CategoryComponent } from './category/components/category.component';
import { CategoryListComponent } from './category/components/category-list/category-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProductsComponent } from './products/products.component';
import { ListProductComponent } from './products/list-product/list-product.component';
import { AddStockComponent } from './stock/components/add-stock/add-stock.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { AddCategoryComponent } from './category/components/add-category/add-category.component';
import { RosterListComponent } from './Roster/components/roster-list/roster-list.component';
import { AddRosterComponent } from './Roster/components/add-roster/add-roster.component';
import { RosterComponent } from './Roster/components/roster.component';


@NgModule({
  imports: [
    SystemDataRoutingModule,
    SharedModule
  ],
  declarations: [
        //system data
        StockListComponent,
        StockComponent,
        SafeBoxComponent,
        SafeBoxListComponent,
        CategoryComponent,
        CategoryListComponent,
        ProductsComponent,
        AddProductComponent ,
        ListProductComponent,
        AddStockComponent,
        AddCategoryComponent,
        RosterListComponent,
        AddRosterComponent,
        RosterComponent,
  ]
})
export class SystemDataModule { }
