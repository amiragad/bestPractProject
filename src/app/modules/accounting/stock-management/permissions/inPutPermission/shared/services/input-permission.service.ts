import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../../../infrastructure/data/ResultSet";
import { inputPermissionList } from "../data/input-permission-list";


@Injectable()
export class InputPermissionService extends BaseService {


  private inPutPermissionBASE_URL: string = this.backendServerUrl.baseApiUrl + 'inPutPermission/';


   add(inputPermission): Observable<any> {
    return this.postData(this.inPutPermissionBASE_URL + "Add", inputPermission);
  }
  getLookup(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Lookup/FindAllLightDetailsByKey/" + key);
  }
  getProductByKey(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/FindLightByKey/" + key);
  }

  getProductByName(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/FindLightByName/" + key);
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

  
  findAll(pagination: PaginationInfo, sorting: OrderInfo, Params?: any): Observable<ResultSet<inputPermissionList>> {
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
        //params = params.append('From', Params.From.toString());
      }
      if (Params.To != null){
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(Params.To);
        let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(Params.To);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(Params.To);
        console.log(`${da}-${mo}-${ye}`);
        params = params.append('To', mo+"-"+da+"-"+ye);
                
      }
     
    }
    return this.getData<ResultSet<inputPermissionList>>(this.inPutPermissionBASE_URL + "FindAll", params);
  }

}