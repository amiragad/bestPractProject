import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../infrastructure/data/ResultSet";
import { SystemParameterDTO } from "../../../shared/models/system-parameter.model";
import { CustomerListModel } from "../data/customer-list";
import { BaseObject } from "../../../suppliers/shared/data/base-object.model";
import { AddEditCustomer } from "../data/customer.addEdit";
@Injectable()
export class CustomerService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Customer/';

  findAll( pagination: PaginationInfo,sorting: OrderInfo,customerParams?: any): Observable<ResultSet<CustomerListModel>>{
    let params: HttpParams = new HttpParams();
    params = params.append('pageNumber', pagination.pageNumber.toString());
    if(pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());

    if(sorting.orderBy)
      params = params.append('orderBy',sorting.orderBy+" "+sorting.orderDir);

    if(customerParams!=null){
        if(customerParams.code!=null)
        params=params.append('code',customerParams.code.toString());
        if(customerParams.name!=null)
        params=params.append('name',customerParams.name.toString());
        if(customerParams.debitor!=null)
        params=params.append('debitor',customerParams.debitor.toString());
    }
   
    return this.getData<ResultSet<CustomerListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel,'multipart/form-data');

  }
  getLookup(key): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsByKey/"+key);
  }
  findById(id): Observable<AddEditCustomer>{
    return this.getAllData<AddEditCustomer>(this.BASE_URL+id);

  }
  getByParent(parentId): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsById/"+parentId);
  }
  getSystemParameter(name): Observable<SystemParameterDTO> {
    return this.getAllData<SystemParameterDTO>(this.backendServerUrl.baseApiUrl+"SystemParameter/"+name);
  }
  activateSupplier(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
  deleteCustomer(id:number)
  {
    return this.get(this.BASE_URL+id+"/DeleteItem");
  }
}