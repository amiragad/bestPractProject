import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../../../infrastructure/interceptors/service/base.service";
import { PaginationInfo } from "../../../../../../infrastructure/interfaces/list/data/pagination-info.model";
import { OrderInfo } from "../../../../../../infrastructure/interfaces/list/data/order-info.model";
import { ResultSet } from "../../../../../../infrastructure/data/ResultSet";
import { SupplierListModel } from "../../../../../../modules/accounting/suppliers/shared/data/supplier.model";
import { BaseObject } from "../../../../../../modules/accounting/suppliers/shared/data/base-object.model";
import { SystemParameterDTO } from "../../../../../../modules/accounting/shared/models/system-parameter.model";
import { CategoryListModel } from "../data/category-list.model";
import { AddEditCategory } from "../data/AddEdit-category.model";


@Injectable()
export class CategoryService extends BaseService {

  
  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'ProductCategory/';
  findAll( pagination: PaginationInfo,sorting: OrderInfo,lang,categoryParams?: any): Observable<ResultSet<CategoryListModel>>{
    let params: HttpParams = new HttpParams();
  

    params = params.append('pageNumber', pagination.pageNumber.toString());
    if(pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());
     if(sorting.orderBy=='name') 
     params = params.append('orderBy',sorting.orderBy+lang+" "+sorting.orderDir);
    else(sorting.orderBy)
      params = params.append('orderBy',sorting.orderBy+" "+sorting.orderDir);

    if(categoryParams!=null){
        if(categoryParams.code!=null)
        params=params.append('code',categoryParams.code.toString());
        if(categoryParams.name!=null)
        params=params.append('name',categoryParams.name.toString());
    }
   
    return this.getData<ResultSet<CategoryListModel>>(this.BASE_URL+"FindAll", params);
  }
  addEdit(postmodel){
  
    return this.postData(this.BASE_URL+"AddEdit",postmodel);

  }
  getLookup(key): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsByKey/"+key);
  }
  getParentList(id): Observable<BaseObject[]>{
    return this.getAllData<BaseObject[]>(this.BASE_URL+"LookupCategory?id="+id);
  }
  findById(id): Observable<AddEditCategory>{
    return this.getAllData<AddEditCategory>(this.BASE_URL+id);

  }
  getByParent(parentId): Observable<BaseObject[]> {
    return this.getAllData<BaseObject[]>(this.backendServerUrl.baseApiUrl+"Lookup/FindAllLightDetailsById/"+parentId);
  }
  getSystemParameter(name): Observable<SystemParameterDTO> {
    return this.getAllData<SystemParameterDTO>(this.backendServerUrl.baseApiUrl+"SystemParameter/"+name);
  }
  activateCategory(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
  deleteCategory(id:number)
  {
    return this.get(this.BASE_URL+id+"/DeleteItem");
  }
}