import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FullRoutes } from '../../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResultSet } from '../../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../../infrastructure/interfaces/list/data/order-info.model';
import { AlertInput } from '../../../../../../shared/alerts/alert-input';
import { CategoryListModel } from '../../shared/data/category-list.model';
import { AlertifyService } from '../../../../../../infrastructure/services/alertify.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from '../../shared/services/category.service';
import { LocalStorageService } from '../../../../../../infrastructure/services/LocalStorageService.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  providers:[CategoryService]
})
export class CategoryListComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.category'}
    ];
    FullRoutes: typeof FullRoutes = FullRoutes;

      searchForm: FormGroup;
      resultSet: ResultSet<CategoryListModel>=new ResultSet<CategoryListModel>();
      orderInfo: OrderInfo = new OrderInfo('id', 'asc');
      id: number;
      alertInput: AlertInput = new AlertInput();
     constructor(private categoryService :CategoryService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService, private fb: FormBuilder,
      private localStorageService: LocalStorageService,) {
      this.ngxService.start();
     }
   
  
  
    ngOnInit() {
   
      this.searchForm = new FormGroup({
        code:new FormControl(),
        name: new FormControl()
        });
        this.findAll();
       this.ngxService.stop();
    }
    pageChanged(page){
      
      this.resultSet.pagination.pageNumber = page;
      this.findAll();
    }
    clearSearch()
    {
      this.searchForm.reset();
    }
    findAll() {
    
      this.categoryService.findAll(this.resultSet.pagination,this.orderInfo,this.localStorageService.getCurrentLanguage(), this.searchForm.value)
      .subscribe(res => {
       this.resultSet=res;
  
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
    }
    paginate(event) {
      this.resultSet.pagination.pageNumber=event.page +1;
      this.resultSet.pagination.pageSize=event.rows;
      this.findAll();
  }
  
  sortAsc(column:string)
  {
    this.orderInfo={orderBy:column,orderDir:'asc'};
    this.findAll();
  }
  sortDesc(column:string)
  {
    this.orderInfo={orderBy:column,orderDir:'desc'};
    this.findAll();
  }
  
  
  
  stopActivate()
  {
  
    this.resultSet.data.find(x=>x.id==this.id).active= !this.resultSet.data.find(x=>x.id==this.id).active;
  }
  activate()
  {
    this.categoryService.activateCategory(this.id).subscribe(() => {
   
       this.findAll();
       this.alertInput = new AlertInput("s", "shared.savedsuccess");
     }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
  
      // this.alertify.error(error);
     });
  }
  deleteItem()
  {
    this.categoryService.deleteCategory(this.id).subscribe(() => {
   
       this.findAll();
       this.alertInput = new AlertInput("s", "shared.savedsuccess");
     }, error => {
      this.alertInput = new AlertInput("f", "error.error406");
  
      // this.alertify.error(error);
     });
  }
}
