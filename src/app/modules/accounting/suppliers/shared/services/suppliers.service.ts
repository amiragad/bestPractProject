import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../infrastructure/data/ResultSet";
import { SupplierListModel } from "../data/supplier.model";
import { BaseObject } from "../data/base-object.model";
import { SystemParameterDTO } from "../../../shared/models/system-parameter.model";
import { AddEditSupplier } from "../data/add-edit-supplier.model";

@Injectable()
export class SupplierService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Supplier/';

  findAll( pagination: PaginationInfo,sorting: OrderInfo,supplierParams?: any): Observable<ResultSet<SupplierListModel>>{
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
   
    return this.getData<ResultSet<SupplierListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel,'multipart/form-data');

  }
  getLookup(key): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsByKey/"+key);
  }
  findById(id): Observable<AddEditSupplier>{
    return this.getAllData<AddEditSupplier>(this.BASE_URL+id);

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
  deleteSupplier(id:number)
  {
    return this.get(this.BASE_URL+id+"/DeleteItem");
  }
}