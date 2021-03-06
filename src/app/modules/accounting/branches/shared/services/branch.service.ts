import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../infrastructure/data/ResultSet";

import { BaseObject } from "../../../suppliers/shared/data/base-object.model";
import { SystemParameterDTO } from "../../../shared/models/system-parameter.model";
import { BranchListModel } from "../data/branch-list.model";
import { AddBranch } from "../data/branch-addedit.model";


@Injectable()
export class BranchService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Branch/';
  findAll( pagination: PaginationInfo,sorting: OrderInfo,supplierParams?: any): Observable<ResultSet<BranchListModel>>{
    let params: HttpParams = new HttpParams();

    params = params.append('pageNumber', pagination.pageNumber.toString());
    if(pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());

    if(sorting.orderBy)
      params = params.append('orderBy',sorting.orderBy+" "+sorting.orderDir);

    if(supplierParams!=null){
        if(supplierParams.code!=null)
        params=params.append('code',supplierParams.code.toString());
        if(supplierParams.name!=null)
        params=params.append('name',supplierParams.name.toString());
       
    }
   
    return this.getData<ResultSet<BranchListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel,'multipart/form-data');

  }

  findById(id): Observable<AddBranch>{
    return this.getAllData<AddBranch>(this.BASE_URL+id);

  }

  getSystemParameter(name): Observable<SystemParameterDTO> {
    return this.getAllData<SystemParameterDTO>(this.backendServerUrl.baseApiUrl+"SystemParameter/"+name);
  }
  activateContactPerson(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
  deleteContactPerson(id:number)
  {
    return this.get(this.BASE_URL+id+"/DeleteItem");
  }

}