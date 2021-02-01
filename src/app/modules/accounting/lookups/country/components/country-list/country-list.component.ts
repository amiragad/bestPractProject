import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { CountryAddEdit } from '../../shared/data/country-addEdit.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PaginationInfo } from '../../../../../../infrastructure/interfaces/list/data/pagination-info.model';
import { ResultSet } from '../../../../../../infrastructure/data/ResultSet';
import { CountryList } from '../../shared/data/country-list.model';
import { CountryService } from '../../shared/services/country.service';
import { OrderInfo } from '../../../../../../infrastructure/interfaces/list/data/order-info.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../../infrastructure/services/alertify.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  providers:[CountryService]
})
export class CountryListComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.country'}
    ];
  searchForm: FormGroup;
  country: CountryAddEdit;
  AddEditForm: FormGroup;
  resultSet: ResultSet<CountryList>=new ResultSet<CountryList>();
  orderInfo: OrderInfo = new OrderInfo('id', 'asc');
  id: number;
  constructor(private alertifyService:AlertifyService, private fb: FormBuilder,private countryService:CountryService, private ngxService: NgxUiLoaderService) {
   /*  this.config = {
      currentPage: 1,
      itemsPerPage: 5
    }; */
    this.ngxService.start();
    this.country = { nameEn: '', nameAr: '', id: 0};
    this.createAddEditForm();
// this.ngxService.startBackground();
  }

  ngOnInit() {
  
  this.searchForm = new FormGroup({
    code:new FormControl(),
    name: new FormControl()
    });
    this.findAll();
   this.ngxService.stop();
   //this.ngxService.stopBackground();
  }
  pageChanged(page){
    debugger
    this.resultSet.pagination.pageNumber = page;
  }
  findAll() {
    this.countryService.findAll(this.resultSet.pagination,this.orderInfo, this.searchForm.value)
    .subscribe(res => {
      debugger
     this.resultSet=res;

    }, error => {
    //  this.alertify.error(error);
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
createAddEditForm() {
  this.AddEditForm = this.fb.group({
    id: [this.country.id],
    nameAR: [this.country.nameAr, [Validators.required]],
    nameEN: [this.country.nameEn, [Validators.required,Validators.minLength(1)]]
  });
}
getCountry(id) {
  this.ngxService.startBackground();
  this.countryService.getCountry(id)
  .subscribe((res: CountryAddEdit) => {
    this.country = res;
    this.createAddEditForm();
   
  }, error => {
  
    //this.alertify.error(error);
  });
  this.ngxService.stopBackground();
}
showDialog(id) {
  debugger
  if (id != 0) {
  this.getCountry(id);
  }
  else {
    this.country = { nameEn: '', nameAr: '', id: 0};
    this.createAddEditForm();

  }
 
}
addEdit(){ 
  this.ngxService.startBackground();
  if (this.AddEditForm.valid) {
   this.country = Object.assign({}, this.AddEditForm.value);
   this.countryService.addEditCountry(this.country).subscribe(() => {
    this.alertifyService.success('shared.options');
 
     this.findAll();
    
   }, error => {
    this.alertifyService.error('shared.options');

    // this.alertify.error(error);
   });
   this.ngxService.stopBackground();
 } 
}
stopActivate()
{
  this.findAll();
 // this.resultSet.data.find(x=>x.id==this.id).active= !this.resultSet.data.find(x=>x.id==this.id).active;
}
activate()
{
  this.countryService.activateCountry(this.id).subscribe(() => {
    this.alertifyService.success('shared.options');
 
     this.findAll();
    
   }, error => {
    this.alertifyService.error('shared.options');

    // this.alertify.error(error);
   });
}
}
