import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../infrastructure/interfaces/list/data/order-info.model";
import { StockListModel } from "../data/stock-list.model";
import { ResultSet } from "../../../../../../infrastructure/data/ResultSet";
import { SupplierListModel } from "../../../../../../modules/accounting/suppliers/shared/data/supplier.model";
import { BaseObject } from "../../../../../../modules/accounting/suppliers/shared/data/base-object.model";
import { AddEditStock } from "../data/addEdit-stock.model";
import { SystemParameterDTO } from "../../../../../../modules/accounting/shared/models/system-parameter.model";


@Injectable()
export class StockService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Stock/';
  private USER_URL: string =this.backendServerUrl.baseApiUrl+'User/';
  BRANCH_URL: string=this.backendServerUrl.baseApiUrl+'Branch/';
  findAll( pagination: PaginationInfo,sorting: OrderInfo,supplierParams?: any): Observable<ResultSet<StockListModel>>{
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
   
    return this.getData<ResultSet<StockListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel,'multipart/form-data');

  }
  getLookup(key): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsByKey/"+key);
  }
  findById(id): Observable<AddEditStock>{
    return this.getAllData<AddEditStock>(this.BASE_URL+id);

  }
  getByParent(parentId): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsById/"+parentId);
  }
  getSystemParameter(name): Observable<SystemParameterDTO> {
    return this.getAllData<SystemParameterDTO>(this.backendServerUrl.baseApiUrl+"SystemParameter/"+name);
  }
  activateStock(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
  deleteStock(id:number)
  {
    return this.get(this.BASE_URL+id+"/DeleteItem");
  }
  activateInitBalance(id:number)
  {
    return this.get(this.BASE_URL+id+"/InitBalance");
  }
  findUserList(): Observable<BaseObject[]>{
    return this.getAllData<BaseObject[]>(this.USER_URL+"userlist");
  }
  findBranches(): Observable<BaseObject[]>{
    return this.getAllData<BaseObject[]>(this.BRANCH_URL+"FindLoockup");
  }
}