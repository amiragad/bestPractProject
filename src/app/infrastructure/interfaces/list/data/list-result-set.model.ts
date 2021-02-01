import {PaginationInfo} from "./pagination-info.model";


export class ListRS<T> {
  data: T[] = [];
  pagination: PaginationInfo = new PaginationInfo();
}
