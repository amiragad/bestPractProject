import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../infrastructure/interfaces/list/data/order-info.model";

import { ResultSet } from "../../../../../../infrastructure/data/ResultSet";
import { SupplierListModel } from "../../../../../../modules/accounting/suppliers/shared/data/supplier.model";
import { BaseObject } from "../../../../../../modules/accounting/suppliers/shared/data/base-object.model";
import { SystemParameterDTO } from "../../../../../../modules/accounting/shared/models/system-parameter.model";
import { RosterListModel } from "../data/roster-list.model";
import { AddEditRoster } from "../data/roster-Addedit.model";


@Injectable()
export class RosterService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Roster/';
 
  findAll( pagination: PaginationInfo,sorting: OrderInfo,rosterParams?: any): Observable<ResultSet<RosterListModel>>{
    let params: HttpParams = new HttpParams();

    params = params.append('pageNumber', pagination.pageNumber.toString());
    if(pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());

    if(sorting.orderBy)
      params = params.append('orderBy',sorting.orderBy+" "+sorting.orderDir);

    if(rosterParams!=null){
        if(rosterParams.code!=null)
        params=params.append('code',rosterParams.code.toString());
        if(rosterParams.name!=null)
        params=params.append('name',rosterParams.name.toString());
    }
   
    return this.getData<ResultSet<RosterListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel);

  }
  
  findById(id): Observable<AddEditRoster>{
    return this.getAllData<AddEditRoster>(this.BASE_URL+id);

  }
 
  getSystemParameter(name): Observable<SystemParameterDTO> {
    return this.getAllData<SystemParameterDTO>(this.backendServerUrl.baseApiUrl+"SystemParameter/"+name);
  }
  activateRoster(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
  deleteRoster(id:number)
  {
    return this.get(this.BASE_URL+id+"/DeleteItem");
  }
 
}