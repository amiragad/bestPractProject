import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../infrastructure/interceptors/service/base.service";
import { LoginModule } from "../data/login-module.model";


@Injectable()
export class HomeService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Authentication/';


authModule(module: string) {
  
    return this.getAllData<LoginModule>(this.BASE_URL+"LoginModule/"+module);
  }}