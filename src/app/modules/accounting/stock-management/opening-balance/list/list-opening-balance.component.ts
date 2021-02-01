import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
 import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { openingBalanceList } from '../shared/data/opening-balance-list';
import { openingBalanceService } from '../shared/services/opening-balance.service';

@Component({
  selector: 'app-list-opening-balance',
  templateUrl: './list-opening-balance.component.html',
  styleUrls: ['./list-opening-balance.component.scss'],
  providers:[openingBalanceService]
})
export class ListOpeningBalanceComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.stock'},
    {url:'', label:'stockManagement.stockBalance.openingBalance'}
  ];
  searchForm : FormGroup = this.fb.group({
    code: [],
    description: [],
    inventory: [],
    date: [],
  });
  resultSet: ResultSet<openingBalanceList> = new ResultSet<openingBalanceList>();
  orderInfo: OrderInfo = new OrderInfo('id', 'asc');
  id: number;
  productGroups: BaseObject[];
  collectAndManufacturs: BaseObject[];
  inventory: BaseObject[];
  constructor(
    private openingBalanceService: openingBalanceService,
    private ngxService: NgxUiLoaderService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder) {
    this.ngxService.start();
  }
  ngOnInit() {
    this.findAll();
    this.ngxService.stop();

    this.getProductGroup();
  }
  pageChanged(page) {
    this.resultSet.pagination.pageNumber = page;
    this.findAll();
  }
  clearSearch() {
    this.searchForm.reset();
    this.findAll();
  }
  findAll() {
    this.openingBalanceService.findAll(this.resultSet.pagination, this.orderInfo, this.searchForm.value)
      .subscribe(res => {
        this.resultSet = res;
      }, error => {
        //  this.alertify.error(error);
      });
  }
  paginate(event) {
    this.resultSet.pagination.pageNumber = event.page + 1;
    this.resultSet.pagination.pageSize = event.rows;
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

  
  getProductGroup() {
    this.openingBalanceService.getStoks()
      .subscribe((res: BaseObject[]) => {
        this.inventory = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }



}
