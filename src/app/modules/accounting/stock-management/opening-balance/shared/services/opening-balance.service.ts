import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../../infrastructure/data/ResultSet";
import { openingBalanceList } from "../data/opening-balance-list";


@Injectable()
export class openingBalanceService extends BaseService {


  private BASE_URL: string = this.backendServerUrl.baseApiUrl + 'InventoryOpeningBalance/';

  findAll(pagination: PaginationInfo, sorting: OrderInfo, supplierParams?: any): Observable<ResultSet<openingBalanceList>> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNumber', pagination.pageNumber.toString());
    if (pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());
    if (sorting.orderBy)
      params = params.append('orderBy', sorting.orderBy + " " + sorting.orderDir);
    if (supplierParams != null) {
      if (supplierParams.code != null)
        params = params.append('code', supplierParams.code.toString());
      if (supplierParams.description != null)
        params = params.append('description', supplierParams.description.toString());
      if (supplierParams.inventory != null)
        params = params.append('inventoryId', supplierParams.inventory.toString());
      if (supplierParams.date != null)
        params = params.append('date', supplierParams.date.toString());
      
    }
    return this.getData<ResultSet<openingBalanceList>>(this.BASE_URL + "FindAll", params);
  }
  addEdit(postmodel) {
    return this.postData(this.BASE_URL + "AddEdit", postmodel);
  }
  getLookup(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Lookup/FindAllLightDetailsByKey/" + key);
  }
  findById(id): Observable<any> {
    return this.getAllData<any>(this.BASE_URL + id);
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
  activate(id: number) {
    return this.get(this.BASE_URL + id + "/Activate");
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

  deletProductUnitById(id): Observable<any> {
    return this.deleteData<any>(this.BASE_URL + id + '/DeleteProductUnit');
  }

  deletAggregateProductById(id): Observable<any> {
    return this.deleteData<any>(this.BASE_URL + id + '/DeleteAggregateProduct');
  }

  getStoks(): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Stock/Lookup");
  }

}