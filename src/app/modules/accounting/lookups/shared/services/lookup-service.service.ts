import { Injectable } from '@angular/core';
import { BaseService } from '../../../../../infrastructure/interceptors/service/base.service';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';
import { PaginationInfo } from '../../../../../infrastructure/interfaces/list/data/pagination-info.model';
import { Observable } from 'rxjs';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { HttpParams } from '@angular/common/http';
import { LookupDetails } from '../data/lookup-details';
import { LightLookupDetailsParent } from '../data/light-lookup-details-parent';
import { LookupMaster } from '../data/lookup-master';
import { LookupAddEdit } from '../data/lookupAddEdit';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';

@Injectable()

export class LookupService extends BaseService{


  private BASE_URL: string =this.backendServerUrl.baseApiUrl+'Lookup/';
//master services
findAllMaster(pagination: PaginationInfo,sorting: OrderInfo,detailsParamsParams?: any): Observable<ResultSet<LookupMaster>>{


  let params: HttpParams = new HttpParams();

  params = params.append('pageNumber', pagination.pageNumber.toString());
  if(pagination.pageSize)
    params = params.append('pageSize', pagination.pageSize.toString());

  if(sorting.orderBy)
    params = params.append('orderBy',sorting.orderBy+" "+sorting.orderDir);

  if(detailsParamsParams!=null){
      if(detailsParamsParams.name!=null)
       params=params.append('name',detailsParamsParams.name.toString());

    
  }
 
  return this.getData<ResultSet<LookupMaster>>(this.BASE_URL+"FindAllMaster", params);
}

  //details services
  findAllDetails(pagination: PaginationInfo,sorting: OrderInfo,detailsParamsParams?: any): Observable<ResultSet<LookupDetails>>{
    let params: HttpParams = new HttpParams();

    params = params.append('pageNumber', pagination.pageNumber.toString());
    if(pagination.pageSize)
      params = params.append('pageSize', pagination.pageSize.toString());

    if(sorting.orderBy)
      params = params.append('orderBy',sorting.orderBy+" "+sorting.orderDir);

    if(detailsParamsParams!=null){
        if(detailsParamsParams.name!=null)
         params=params.append('name',detailsParamsParams.name.toString());


        if(detailsParamsParams.parentId!=null)
         params=params.append('ParentId',detailsParamsParams.parentId);

        if(detailsParamsParams.masterId!=null)
         params=params.append('MasterId',detailsParamsParams.masterId.toString());
    }
   
    return this.getData<ResultSet<LookupDetails>>(this.BASE_URL+"FindAllDetails", params);
  }
  getParents(key:String):Observable<Array<LightLookupDetailsParent>>{
    return this.get(this.BASE_URL+"FindAllLightDetailsByKey/"+key);
  }
  findByName(id:string):Observable<BaseObject>
  {
    return this.get<BaseObject>(this.BASE_URL+id+"/FindName");
  }
   save(lookupDetail:any):Observable<ResultSet<any>>{
     return this.postData(this.BASE_URL+"AddEdit",lookupDetail);
   }

   getForEdit(id:number):Observable<LookupAddEdit>{
    return this.get(this.BASE_URL+"edit/"+id);
  }

   delete(id:number):Observable<ResultSet<any>>{
    return this.getData(this.BASE_URL+"Delete/"+id,null);
  }
  activatedetails(id:number)
  {
    return this.get(this.BASE_URL+id+"/Activate");
  }
}
