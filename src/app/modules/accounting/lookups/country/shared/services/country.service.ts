import { Injectable } from "@angular/core";
import { BaseService } from "../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../infrastructure/interfaces/list/data/order-info.model";
import { Observable } from "rxjs";
import { ResultSet } from "../../../../../../infrastructure/data/ResultSet";
import { CountryList } from "../data/country-list.model";
import { HttpParams } from "@angular/common/http";
import { CountryAddEdit } from "../data/country-addEdit.model";

@Injectable()
export class CountryService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Country/';

  findAll( pagination: PaginationInfo,sorting: OrderInfo,countryParams?: any): Observable<ResultSet<CountryList>>{
    let params: HttpParams = new HttpParams();

    params = params.append('pageNumber', pagination.pageNumber.toString());
    if(pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());

    if(sorting.orderBy)
      params = params.append('orderBy',sorting.orderBy+" "+sorting.orderDir);

    if(countryParams!=null){
        if(countryParams.code!=null)
        params=params.append('code',countryParams.code.toString());
        if(countryParams.name!=null)
        params=params.append('name',countryParams.name.toString());
    }
   
    return this.getData<ResultSet<CountryList>>(this.BASE_URL+"FindAll", params);
  }
  
  getCountry( id:number): Observable<CountryAddEdit>{
    return this.get<CountryAddEdit>(this.BASE_URL+id);
  }
  addEditCountry(country:CountryAddEdit)
  {
    return this.postData(this.BASE_URL+"AddEdit",country);
  }
  activateCountry(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
}