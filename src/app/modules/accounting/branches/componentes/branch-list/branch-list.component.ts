import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../shared/services/branch.service';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { BranchListModel } from '../../shared/data/branch-list.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  providers:[BranchService]
})
export class BranchListComponent implements OnInit {

  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.branches'}
    ];
    searchForm: FormGroup;
    resultSet: ResultSet<BranchListModel>=new ResultSet<BranchListModel>();
    orderInfo: OrderInfo = new OrderInfo('id', 'asc');
    id: number;
    alertInput: AlertInput = new AlertInput();
   constructor(private branchService :BranchService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService, private fb: FormBuilder) {
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
    this.branchService.findAll(this.resultSet.pagination,this.orderInfo, this.searchForm.value)
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
  this.branchService.activateContactPerson(this.id).subscribe(() => {
 
     this.findAll();
     this.alertInput = new AlertInput("s", "shared.savedsuccess");
   }, error => {
    this.alertInput = new AlertInput("f", "error.error500");

    // this.alertify.error(error);
   });
}
  
deleteItem()
{
  this.branchService.deleteContactPerson(this.id).subscribe(() => {
 
     this.findAll();
     this.alertInput = new AlertInput("s", "shared.savedsuccess");
   }, error => {
    this.alertInput = new AlertInput("f", "error.error406");

    // this.alertify.error(error);
   });
}

}
