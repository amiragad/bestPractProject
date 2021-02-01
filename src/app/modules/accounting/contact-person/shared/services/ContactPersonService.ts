import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../infrastructure/data/ResultSet";
import { ContactPersonListModel } from "../data/contact-person-list.model";
import { BaseObject } from "../../../suppliers/shared/data/base-object.model";
import { AddEditContactPerson } from "../data/contact-person-AddEdit.model";
import { SystemParameterDTO } from "../../../shared/models/system-parameter.model";


@Injectable()
export class ContactPersonService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'ClientContactPerson/';
  private ROSTER_URL: string =this.backendServerUrl.baseApiUrl+'Roster/';
  private CUSTOMER_URL: string =this.backendServerUrl.baseApiUrl+'Customer/';
  findAll( pagination: PaginationInfo,sorting: OrderInfo,supplierParams?: any): Observable<ResultSet<ContactPersonListModel>>{
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
        if(supplierParams.debitor!=null)
        params=params.append('debitor',supplierParams.debitor.toString());
    }
   
    return this.getData<ResultSet<ContactPersonListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel,'multipart/form-data');

  }
  findRosterList(){
    return this.getAllData<BaseObject[]>(this.ROSTER_URL+"FindLockup");
  }
  getCustomers(value)
  {
    return this.getAllData<BaseObject[]>(this.CUSTOMER_URL+"FindLookups/"+value);
  }
  findById(id): Observable<AddEditContactPerson>{
    return this.getAllData<AddEditContactPerson>(this.BASE_URL+id);

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