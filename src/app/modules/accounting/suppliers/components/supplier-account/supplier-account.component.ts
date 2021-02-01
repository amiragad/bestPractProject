import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { SupplierEnum } from '../../shared/data/supplier.enum';
import { SupplierService } from '../../shared/services/suppliers.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { SupplierListModel } from '../../shared/data/supplier.model';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { AlertInput } from '../../../../../shared/alerts/alert-input';

@Component({
  selector: 'app-supplier-account',
  templateUrl: './supplier-account.component.html',
  providers:[SupplierService]
})
export class SupplierAccountComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.suppliersManagement.title'},
    {url:'', label:'sideNav.suppliersManagement.supplierAccountsView'}
    ];
    searchForm: FormGroup;
    resultSet: ResultSet<SupplierListModel>=new ResultSet<SupplierListModel>();
    orderInfo: OrderInfo = new OrderInfo('id', 'asc');
    id: number;
    alertInput: AlertInput = new AlertInput();
   constructor(private supplierService :SupplierService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService, private fb: FormBuilder) {
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
    this.supplierService.findAll(this.resultSet.pagination,this.orderInfo, this.searchForm.value)
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
  this.supplierService.activateSupplier(this.id).subscribe(() => {
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
  this.supplierService.deleteSupplier(this.id).subscribe(() => {
 
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
