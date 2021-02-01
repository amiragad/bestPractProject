import { Component, OnInit } from '@angular/core';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';
import { CustomerListModel } from '../../shared/data/customer-list';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomerService } from '../../shared/services/customer.service';
import { AlertInput } from '../../../../../shared/alerts/alert-input';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  providers:[CustomerService]
})
export class CustomerListComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;
  alertInput: AlertInput = new AlertInput();
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.cutomersManagement.title'},
    {url:'', label:'sideNav.cutomersManagement.customerAccountsView'}
    ];
    searchForm: FormGroup;
    resultSet: ResultSet<CustomerListModel>=new ResultSet<CustomerListModel>();
    orderInfo: OrderInfo = new OrderInfo('id', 'asc');
    id: number;
   constructor(private customerService :CustomerService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService, private fb: FormBuilder) {
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
    debugger
    this.resultSet.pagination.pageNumber = page;
    this.findAll();
  }
  clearSearch()
  {
    this.searchForm.reset();
  }
  findAll() {
    this.customerService.findAll(this.resultSet.pagination,this.orderInfo, this.searchForm.value)
    .subscribe(res => {
     this.resultSet=res;
     this.ngxService.stop();
    }, error => {
    //  this.alertify.error(error);
    this.ngxService.stop();
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
  this.customerService.activateSupplier(this.id).subscribe(() => {
    this.alertInput = new AlertInput("s", "shared.savedsuccess");
 
     this.findAll();
    
   }, error => {
      
    if(error.status==405)
    this.alertInput = new AlertInput("f", "error.error4020");
    else
    this.alertInput = new AlertInput("f", "error.error500");
    this.resultSet.data.find(x=>x.id==this.id).active= !this.resultSet.data.find(x=>x.id==this.id).active;
  

    // this.alertify.error(error);
   });
}
deleteItem()
{
  this.customerService.deleteCustomer(this.id).subscribe(() => {
 
     this.findAll();
     this.alertInput = new AlertInput("s", "shared.savedsuccess");
   }, error => {
    
     if(error.status==405)
     this.alertInput = new AlertInput("f", "error.error405");
     else
     this.alertInput = new AlertInput("f", "error.error406");


    // this.alertify.error(error);
   });
}

}
