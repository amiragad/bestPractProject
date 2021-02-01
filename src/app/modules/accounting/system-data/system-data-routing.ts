
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/components/category.component';
import { CategoryListComponent } from './category/components/category-list/category-list.component';
import { StockComponent } from './stock/components/stock.component';
import { StockListComponent } from './stock/components/stock-list/stock-list.component';
import { SafeBoxComponent } from './safe-box/components/safe-box.component';
import { SafeBoxListComponent } from './safe-box/components/safe-box-list/safe-box-list.component';
import { ProductsComponent } from './products/products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ListProductComponent } from './products/list-product/list-product.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';
import { AddStockComponent } from './stock/components/add-stock/add-stock.component';
import { AddCategoryComponent } from './category/components/add-category/add-category.component';
import { RosterListComponent } from './Roster/components/roster-list/roster-list.component';
import { AddRosterComponent } from './Roster/components/add-roster/add-roster.component';
import { RosterComponent } from './Roster/components/roster.component';

const systemDataRoutes: Routes = [
    {
        path: '', children: [
            {
              path: FullRoutes.CATEGORY_LIST, component: CategoryComponent,
              children: [
                { path: '', component: CategoryListComponent },
                { path:FullRoutes.ADD_CATEGORY , component: AddCategoryComponent },
                { path: FullRoutes.ADD_CATEGORY +'/:id', component: AddCategoryComponent }
              ]
            },
            {
              path:FullRoutes.STOCK_LIST , component: StockComponent,
              children: [
                { path: '', component: StockListComponent },
                { path:FullRoutes.ADD_STOCK , component: AddStockComponent },
                { path: FullRoutes.ADD_STOCK +'/:id', component: AddStockComponent }
        
              ]
            },
            {
              path:FullRoutes.ROSTER_LIST , component: RosterComponent,
              children: [
                { path: '', component: RosterListComponent },
                { path:FullRoutes.ADD_ROSTER , component: AddRosterComponent },
                { path: FullRoutes.ADD_ROSTER +'/:id', component: AddRosterComponent }
        
              ]
            },
            {
              path: 'safeBox', component: SafeBoxComponent,
              children: [
                { path: '', component: SafeBoxListComponent }
              ]
            },
            { path:FullRoutes.PRODUCT, component: ProductsComponent, children:[
              { path: '', pathMatch: 'full', redirectTo: FullRoutes.PRODUCT_LIST},
              { path: FullRoutes.PRODUCT_LIST, component: ListProductComponent},
              { path: FullRoutes.ADD_PRODUCT, component: AddProductComponent},
              { path: FullRoutes.EDIT_PRODUCT +'/:id', component: AddProductComponent },
              ]
            }
          
          ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(systemDataRoutes)],
    exports: [RouterModule]
})
export class SystemDataRoutingModule {
}
