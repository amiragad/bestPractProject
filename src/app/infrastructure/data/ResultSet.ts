/**
 * Created by Ahemd Shaikoun on 5/2/2018.
 */
import {PaginationInfo} from "../interfaces/list/data/pagination-info.model";


export class ResultSet<T> {
  results: T[] = [];
  data: T[] = [];
  count:any;
  pagination: PaginationInfo = new PaginationInfo();
  errorMessage: string = null;
  message: string = null;
  error: string = null;
  list:T[]=[];
}
