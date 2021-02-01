
export class PaginationInfo {
  static readonly PAGE_NUM_QUERY: string = 'pageNumber';
  static readonly PAGE_SIZE_QUERY: string = 'pageSize';

  pageNumber: number = 1; // Current Page number
  pageSize: number = 5; // Num of Records per Page
  total: number = 0; //Total Count of records returned from Query
  offset: number = 0; //Total num of records before this Page = (pageNum * pageSize)
}
