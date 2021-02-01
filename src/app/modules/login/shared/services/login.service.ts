import { LocalStorageService } from "../../../../infrastructure/services/LocalStorageService.service";
import { BaseService } from "../../../../infrastructure/interceptors/service/base.service";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from "@angular/router";
import { ServerUrl } from "../../../../infrastructure/interceptors/service/server-url.model";
import { AvilableServersEnum } from "../../../../../environments/configuration/avilable-servers.enum";
import { avilableServers } from "../../../../../environments/configuration/avilable-servers";
import { ServerApiUrlDev } from "../../../../../environments/configuration/environment.dev";
import { ServerApiUrlTest } from "../../../../../environments/configuration/environment.test";
import { ServerApiUrlProd } from "../../../../../environments/configuration/environment.prod";
import { LoginDTO } from "../data/login.model";

@Injectable()
export class LoginService {

  protected _avilableServers: AvilableServersEnum = avilableServers;
  protected backendServerUrl: ServerUrl;
  constructor(
    private http: HttpClient,
    router: Router,
    localStService: LocalStorageService,
    private _translateService: TranslateService
  ) {
    this.setBackendServerUrl();
  }

  private setBackendServerUrl(): void {
    if (this._avilableServers == AvilableServersEnum.ApiUrlDev) {
      this.backendServerUrl = ServerApiUrlDev;
    }
    else if (this._avilableServers == AvilableServersEnum.ApiUrlTest) {
      this.backendServerUrl = ServerApiUrlTest;
    }
    else if (this._avilableServers == AvilableServersEnum.ApiUrlProd) {
      this.backendServerUrl = ServerApiUrlProd;
    }
  }
  login(data: LoginDTO): Observable<any> {
    let url: string = this.backendServerUrl.baseApiUrl + 'Authentication/Login';
    let _headers: HttpHeaders = new HttpHeaders();
   // _headers = _headers.append('Authorization', 'Basic ' + btoa(data.userName + ':' + data.password));
   // _headers = _headers.append("username", data.userName);
    //_headers = _headers.append("Accept-Language", this._translateService.currentLang);
  //  _headers = _headers.append("Content-Type", 'application/json');
    
    return this.http.post<any>(url, data, { headers: _headers });
  }
  logout() {
  }

}