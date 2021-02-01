
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';


const routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },/*
  {path: 'dashboard', component: StockDashboardComponent},*/
  {
    path: 'stock',
    loadChildren: './modules/accounting/stock-management/stock-management.module#StockManagementModule'
  },
  {
    path: 'pos',
    loadChildren: './modules/accounting/pos/pos.module#PosModule'
  },
  {
    path: 'purchases',
    loadChildren: './modules/accounting/purchases/purchases.module#PurchasesModule'
  },
  {
    path: 'sales',
    loadChildren: './modules/accounting/sales/Modules/sales.module#SalesModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
