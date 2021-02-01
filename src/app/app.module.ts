import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalStorageService } from './infrastructure/services/LocalStorageService.service';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginFooterComponent } from './shared/login-footer/login-footer.component';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import { getAccessToken } from './infrastructure/directives/authorization/getAccessToken';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxUiLoaderModule, NgxUiLoaderConfig, POSITION, SPINNER, PB_DIRECTION } from 'ngx-ui-loader';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  //bgsColor: 'red',
  bgsPosition: POSITION.bottomRight,
  bgsSize: 100,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.rectangleBounce  , // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 3, // progress bar thickness

};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LoginFooterComponent,
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: getAccessToken
      }
    }),
    BrowserModule,
    AppRoutingModule,
     BrowserAnimationsModule,
     NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    SharedModule,
    NgbModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // RouterModule.forRoot(routes)
  ],
  providers: [
    LocalStorageService,
    JwtHelperService,
    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
