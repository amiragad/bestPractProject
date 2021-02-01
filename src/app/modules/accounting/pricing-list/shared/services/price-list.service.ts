import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../infrastructure/data/ResultSet";
import { BaseObject } from "../../../suppliers/shared/data/base-object.model";
import { SystemParameterDTO } from "../../../shared/models/system-parameter.model";
import { PriceListListModel } from "../data/price-list.model";
import { AddEditPriceList } from "../data/price-list-addedit.model";


@Injectable()
export class PriceListService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'PriceList/';
  private PRODUCT_URL: string =this.backendServerUrl.baseApiUrl+'Product/';

  findAll( pagination: PaginationInfo,sorting: OrderInfo,supplierParams?: any): Observable<ResultSet<PriceListListModel>>{
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
   
    return this.getData<ResultSet<PriceListListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel);

  }
  getLookup(key): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsByKey/"+key);
  }
  findProductList(): Observable<BaseObject[]>{
    return this.getAllData<BaseObject[]>(this.PRODUCT_URL+"Lookup");
  }

  findById(id): Observable<AddEditPriceList>{
    return this.getAllData<AddEditPriceList>(this.BASE_URL+id);

  }

  getSystemParameter(name): Observable<SystemParameterDTO> {
    return this.getAllData<SystemParameterDTO>(this.backendServerUrl.baseApiUrl+"SystemParameter/"+name);
  }
  activate(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
  deleteItem(id:number)
  {
    return this.get(this.BASE_URL+id+"/DeleteItem");
  }
  getProductByName(key): Observable<any[]> {
    return this.getAllData<any[]>(this.backendServerUrl.baseApiUrl + "Product/FindLightByName/" + key);
  }

  getMeasuringUnitsById(id): Observable<any> {
    return this.getAllData<any>(this.backendServerUrl.baseApiUrl +"Product/ProductUnit/" + id);
  }
}