import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SortComponent } from './sort/sort.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { LoginFooterComponent } from './login-footer/login-footer.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularResizedEventModule } from 'angular-resize-event';
import { AlertifyService } from '../infrastructure/services/alertify.service';
import { AuthorizeViewDirective } from '../infrastructure/directives/authorization/auth-view.directive';
import { AuthorizeActionDirective } from '../infrastructure/directives/authorization/auth-action.directive';
import { ValidatorDirective } from '../infrastructure/directives/validator/validator.directive';
import { ClickOutsideDirective } from '../infrastructure/directives/css-directives/clickOutside.directive';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from '@angular/material/select'
import {MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatNativeDateModule} from "@angular/material";
import { AlertComponent } from './alerts/alert.component';
import { SideBarStockComponent } from '../modules/accounting/stock-management/shared/side-bar-stock/side-bar-stock.component';
const DIRECTIVES = [AuthorizeViewDirective, AuthorizeActionDirective, ValidatorDirective,  ClickOutsideDirective];
@NgModule({
  imports: [

    CommonModule,
    SharedRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    AngularResizedEventModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
      TranslateModule/* .forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),  */
  ],
  declarations: [
    HeaderComponent,FooterComponent,SideBarStockComponent,
    SortComponent,BreadcrumbComponent,DIRECTIVES,AlertComponent
  ],
  providers:[AlertifyService],
  exports:[ HeaderComponent,FooterComponent,SideBarStockComponent,
    SortComponent,BreadcrumbComponent,AlertComponent,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    AngularResizedEventModule,
    NgxChartsModule,
    HttpClientModule,
    DIRECTIVES
  ]
})
export class SharedModule { }
