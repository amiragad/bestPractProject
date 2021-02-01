import { Component, OnInit } from '@angular/core';
import { ContactPersonService } from '../../shared/services/ContactPersonService';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ContactPersonListModel } from '../../shared/data/contact-person-list.model';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';

@Component({
  selector: 'app-contact-person-list',
  templateUrl: './contact-person-list.component.html',
  providers:[ContactPersonService]
})
export class ContactPersonListComponent implements OnInit {


  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.cutomersManagement.title'},
    {url:'', label:'sideNav.contactperson'}
    ];
    searchForm: FormGroup;
    resultSet: ResultSet<ContactPersonListModel>=new ResultSet<ContactPersonListModel>();
    orderInfo: OrderInfo = new OrderInfo('id', 'asc');
    id: number;
    alertInput: AlertInput = new AlertInput();
   constructor(private stockService :ContactPersonService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService, private fb: FormBuilder) {
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
  this.stockService.activateContactPerson(this.id).subscribe(() => {
 
     this.findAll();
     this.alertInput = new AlertInput("s", "shared.savedsuccess");
   }, error => {
    this.alertInput = new AlertInput("f", "error.error500");

    // this.alertify.error(error);
   });
}
  
deleteItem()
{
  this.stockService.deleteContactPerson(this.id).subscribe(() => {
 
     this.findAll();
     this.alertInput = new AlertInput("s", "shared.savedsuccess");
   }, error => {
    this.alertInput = new AlertInput("f", "error.error406");

    // this.alertify.error(error);
   });
}

}
