import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FullRoutes } from '../../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResultSet } from '../../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../../infrastructure/interfaces/list/data/order-info.model';
import { StockListModel } from '../../shared/data/stock-list.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../../infrastructure/services/alertify.service';
import { StockService } from '../../shared/services/stock.service';
import { AlertInput } from '../../../../../../shared/alerts/alert-input';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  providers:[StockService]
})
export class StockListComponent implements OnInit {


    FullRoutes: typeof FullRoutes = FullRoutes;
    breadCrumbItems: BreadCrumbItem[] = [
      {url:'', label:'sideNav.basicData'},
      {url:'', label:'sideNav.stock'}
      ];
      searchForm: FormGroup;
      resultSet: ResultSet<StockListModel>=new ResultSet<StockListModel>();
      orderInfo: OrderInfo = new OrderInfo('id', 'asc');
      id: number;
      alertInput: AlertInput = new AlertInput();
     constructor(private stockService :StockService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService, private fb: FormBuilder) {
      this.ngxService.start();
     }
   
  
  
    ngOnInit() {
   
      this.searchForm = new FormGroup({
        code:new FormControl(),
        name: new FormControl(),
        debitor: new FormControl()
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
      this.stockService.findAll(this.resultSet.pagination,this.orderInfo, this.searchForm.value)
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
    this.stockService.activateStock(this.id).subscribe(() => {
   
       this.findAll();
       this.alertInput = new AlertInput("s", "shared.savedsuccess");
     }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
  
      // this.alertify.error(error);
     });
  }
    
  stopInitBalance()
  {
    debugger
    this.resultSet.data.find(x=>x.id==this.id).initBalance= !this.resultSet.data.find(x=>x.id==this.id).initBalance;
  }
  initBalance()
  {
     this.stockService.activateInitBalance(this.id).subscribe(() => {
   
       this.findAll();
       this.alertInput = new AlertInput("s", "shared.savedsuccess");
     }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
  
      // this.alertify.error(error);
     });
  }
  deleteItem()
  {
    this.stockService.deleteStock(this.id).subscribe(() => {
   
       this.findAll();
       this.alertInput = new AlertInput("s", "shared.savedsuccess");
     }, error => {
      this.alertInput = new AlertInput("f", "error.error406");
  
      // this.alertify.error(error);
     });
  }
}
