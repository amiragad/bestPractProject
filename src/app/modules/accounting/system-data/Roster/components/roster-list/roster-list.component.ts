import { Component, OnInit } from '@angular/core';
import { RosterService } from '../../shared/services/roster.service';
import { FullRoutes } from '../../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ResultSet } from '../../../../../../infrastructure/data/ResultSet';
import { RosterListModel } from '../../shared/data/roster-list.model';
import { OrderInfo } from '../../../../../../infrastructure/interfaces/list/data/order-info.model';
import { AlertInput } from '../../../../../../shared/alerts/alert-input';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../../infrastructure/services/alertify.service';

@Component({
  selector: 'app-roster-list',
  templateUrl: './roster-list.component.html',
  providers:[RosterService]
})
export class RosterListComponent implements OnInit {

  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.roster'}
    ];
    searchForm: FormGroup;
    resultSet: ResultSet<RosterListModel>=new ResultSet<RosterListModel>();
    orderInfo: OrderInfo = new OrderInfo('id', 'asc');
    id: number;
    alertInput: AlertInput = new AlertInput();
   constructor(private rosterService :RosterService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService, private fb: FormBuilder) {
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
    this.rosterService.findAll(this.resultSet.pagination,this.orderInfo, this.searchForm.value)
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
  this.rosterService.activateRoster(this.id).subscribe(() => {
 
     this.findAll();
     this.alertInput = new AlertInput("s", "shared.savedsuccess");
   }, error => {
    this.alertInput = new AlertInput("f", "error.error500");

    // this.alertify.error(error);
   });
}
  

deleteItem()
{
  this.rosterService.deleteRoster(this.id).subscribe(() => {
 
     this.findAll();
     this.alertInput = new AlertInput("s", "shared.savedsuccess");
   }, error => {
    this.alertInput = new AlertInput("f", "error.error406");

    // this.alertify.error(error);
   });
}

}
