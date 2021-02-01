import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../../infrastructure/data/ResultSet";
import { productList } from "../data/productList";


@Injectable()
export class ProductService extends BaseService {


  private BASE_URL: string = this.backendServerUrl.baseApiUrl + 'Product/';

  findAll(pagination: PaginationInfo, sorting: OrderInfo, supplierParams?: any): Observable<ResultSet<productList>> {
    let params: HttpParams = new HttpParams();
    params = params.append('pageNumber', pagination.pageNumber.toString());
    if (pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());
    if (sorting.orderBy)
      params = params.append('orderBy', sorting.orderBy + " " + sorting.orderDir);
    if (supplierParams != null) {
      if (supplierParams.code != null)
        params = params.append('code', supplierParams.code.toString());
      if (supplierParams.name != null)
        params = params.append('name', supplierParams.name.toString());
      if (supplierParams.collectAndManufactur != null)
        params = params.append('CollectAndManufacturId', supplierParams.collectAndManufactur.toString());
      if (supplierParams.active != null)
        params = params.append('active', supplierParams.active.toString());
      if (supplierParams.groupName != null)
        params = params.append('ProductGroupId', supplierParams.groupName.toString());
    }
    return this.getData<ResultSet<productList>>(this.BASE_URL + "FindAll", params);
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
  getByParent(parentId): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Lookup/FindAllLightDetailsById/" + parentId);
  }
  getSystemParameter(name): Observable<any> {
    return this.getAllData<any>(this.backendServerUrl.baseApiUrl + "SystemParameter/" + name);
  }
  getProduct(name?: any,code?: any): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/GetProductsLookupsForPurchasesInvoice?name="+name);
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
    return this.getAllData<any[]>(this.BASE_URL + "Lookup");
  }
  deletProductUnitById(id): Observable<any> {
    return this.deleteData<any>(this.BASE_URL + id+ '/DeleteProductUnit' );
  }
  deletAggregateProductById(id): Observable<any> {
    return this.deleteData<any>(this.BASE_URL + id+ '/DeleteAggregateProduct' );
  }
  deletProductById(id): Observable<any> {
    return this.deleteData<any>(this.BASE_URL + id+ '/DeleteItem' );
  }

}