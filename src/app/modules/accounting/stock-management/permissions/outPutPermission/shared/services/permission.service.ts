import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../../../infrastructure/data/ResultSet";
import { OutputPermissionList } from "../data/output-permission-list";


@Injectable()
export class PermissionService extends BaseService {


  private OutPutPermissionBASE_URL: string = this.backendServerUrl.baseApiUrl + 'OutPutPermission/';


   add(OutputPermission): Observable<any> {
    return this.postData(this.OutPutPermissionBASE_URL + "Add", OutputPermission);
  }
  getLookup(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Lookup/FindAllLightDetailsByKey/" + key);
  }

  getProductByName(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/FindLightByName/" + key);
  }

  
  getProductByKey(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/FindLightByKey/" + key);
  }

  getMeasuringUnitsById(id): Observable<any> {
    return this.getAllData<any>(this.backendServerUrl.baseApiUrl +"Product/ProductUnit/" + id);
  }
  getByParent(parentId): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Lookup/FindAllLightDetailsById/" + parentId);
  }
  getSystemParameter(name): Observable<any> {
    return this.getAllData<any>(this.backendServerUrl.baseApiUrl + "SystemParameter/" + name);
  }

  getProductCategories(): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "ProductCategory/Lookup");
  }
  // MeasuringUnit
  getMeasuringUnits(): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "MeasuringUnit/Lookup");
  }
  getProducts(): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/Lookup");
  }



  getStoks(): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Stock/Lookup");
  }

  
  findAll(pagination: PaginationInfo, sorting: OrderInfo, Params?: any): Observable<ResultSet<OutputPermissionList>> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNumber', pagination.pageNumber.toString());
    if (pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());
    if (sorting.orderBy)
      params = params.append('orderBy', sorting.orderBy + " " + sorting.orderDir);
    if (Params != null) {
      if (Params.DocumentCode != null)
        params = params.append('DocumentCode', Params.DocumentCode.toString());
      if (Params.BookCode != null)
        params = params.append('BookCode', Params.BookCode.toString());

        if (Params.InverntoryName != null)
        params = params.append('InverntoryName', Params.InverntoryName.toString());
      if (Params.From != null){
let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(Params.From);
let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(Params.From);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(Params.From);
console.log(`${da}-${mo}-${ye}`);
        params = params.append('From', mo+"-"+da+"-"+ye);
      }
      if (Params.To != null){
      let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(Params.To);
let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(Params.To);
let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(Params.To);
console.log(`${da}-${mo}-${ye}`);

        params = params.append('To', mo+"-"+da+"-"+ye);
      }
     
    }
    return this.getData<ResultSet<OutputPermissionList>>(this.OutPutPermissionBASE_URL + "FindAll", params);
  }

}