import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LookupService } from '../shared/services/lookup-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ResultSet } from '../../../../infrastructure/data/ResultSet';
import { LookupMaster } from '../shared/data/lookup-master';
import { OrderInfo } from '../../../../infrastructure/interfaces/list/data/order-info.model';
import { BreadCrumbItem } from '../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-lookup-list',
  templateUrl: './lookup-list.component.html',
  styleUrls: ['./lookup-list.component.scss']
})
export class LookupListComponent implements OnInit {

  constructor(private lookupService: LookupService, private ngxService: NgxUiLoaderService,
    private activatedRoute :ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.createSearchForm();
    this.findAll();

  }
  searchForm: FormGroup ;
  resultSet: ResultSet<LookupMaster> = new ResultSet<LookupMaster>();
  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'sideNav.basicData' },
    { url: '', label: 'sideNav.lookup' }
  ];

  orderInfo: OrderInfo = new OrderInfo('Id', 'DESC');

  createSearchForm() {
    
    this.searchForm = this.fb.group({
      name: [],
  
    });
  }
  pageChanged(page) {
    this.resultSet.pagination.pageNumber = page;
      this.findAll();
      
 }
  sortAsc(column: string) {
    this.orderInfo = { orderBy: column, orderDir: 'asc' };
    this.findAll();
  }
  sortDesc(column: string) {
    this.orderInfo = { orderBy: column, orderDir: 'desc' };
    this.findAll();
  }
  findAll() {
    this.ngxService.start();

     let  serachFields={
         "name":this.searchForm.get("name").value,
  };
    this.lookupService.findAllMaster(this.resultSet.pagination, this.orderInfo, serachFields)
      .subscribe(res => {
        this.resultSet = res;
        this.ngxService.stop();


      }, error => {
        this.ngxService.stop();
        console.log(JSON.stringify(error));
      });
  }
  paginate(event) {
    this.resultSet.pagination.pageNumber=event.page +1;
    this.resultSet.pagination.pageSize=event.rows;
    this.findAll();
}

  clearSearch(){
    this.searchForm.get("name").setValue(null);
    this.findAll();
  }
}
