import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { ResultSet } from "../../../../../infrastructure/data/ResultSet";
import { OrderInfo } from "../../../../../infrastructure/interfaces/list/data/order-info.model";
import { BaseObject } from "../../../suppliers/shared/data/base-object.model";


@Injectable()
export class SalesInvoiceService extends BaseService {


  private BASE_URL: string = this.backendServerUrl.baseApiUrl + 'SalesInvoice/';

  findAll(pagination: PaginationInfo, sorting: OrderInfo, supplierParams?: any): Observable<ResultSet<any>> {
      supplierParams.pageNumber=pagination.pageNumber;
      supplierParams.pageSize=pagination.pageSize;
      supplierParams.orderBy= sorting.orderBy+" "+sorting.orderDir;
    return this.postData<ResultSet<any>>(this.BASE_URL + "GetSalesInvoices", supplierParams);
  }


  addEdit(postmodel) {
    return this.postData(this.BASE_URL + "AddEdit", postmodel);
  }
 
  findById(id): Observable<any> {
    return this.getAllData<any>(this.BASE_URL + id+"/GetSalesInvoiceById");
  }
  getSystemParameter(name): Observable<any> {
    return this.getAllData<any>(this.backendServerUrl.baseApiUrl + "SystemParameter/" + name);
  }

  getProducts(): Observable<any[]> {
    return this.getAllData<any[]>(this.BASE_URL + "Lookup");
  }
  deletPurchaseProductById(id): Observable<any> {
    return this.deleteData<any>(this.BASE_URL + id + '/DeleteProductUnit');
  }
  deleteById(id): Observable<any> {
    return this.deleteData<any>(this.BASE_URL + id + '/Delete');
  }

  getCustomer(value: any): Observable<any[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl + "Customer/FindLookups/"+value);
  }

  findDelegateById(id): Observable<any> {
    return this.getAllData<any>(this.backendServerUrl.baseApiUrl+"ClientContactPerson/" + id+"/GetContactPersonByCustomerId");
  }

  getProduct(name?: any,code?: any): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/GetProductsLookupsForSalesInvoice?name="+name);
  }
  getProductsByCode(code?: any): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/GetProductsLookupsForPurchasesInvoice?code="+code);
  }

}