import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../../infrastructure/dto/BreadCrumbItem.dto';
 import { FullRoutes } from '../../../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ResultSet } from '../../../../../../../infrastructure/data/ResultSet';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../../../infrastructure/services/alertify.service';
import { OutputPermissionList } from '../../shared/data/output-permission-list';
import { BaseObject } from '../../../../../suppliers/shared/data/base-object.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PermissionService } from '../../shared/services/permission.service';
import { OrderInfo } from '../../../../../../../infrastructure/interfaces/list/data/order-info.model';
import { DateAdapter } from '@angular/material';


@Component({
  selector: 'app-list-outPermission',
  templateUrl: './add-permission-list.component.html',
  styleUrls: ['./add-permission-list.component.scss'],
})
export class AddPermissionListComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;

  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'stockManagement.permissions.permissions' },
    { url: '', label: 'stockManagement.permissions.outPutPermission' }
  ];
  searchForm : FormGroup = this.fb.group({
    DocumentCode: [],
    BookCode: [],
    InverntoryName: [],
    From: [],
    To: []
  });
  resultSet: ResultSet<OutputPermissionList> = new ResultSet<OutputPermissionList>();
  orderInfo: OrderInfo = new OrderInfo('id', 'asc');
  id: number;
  productGroups: BaseObject[];
  collectAndManufacturs: BaseObject[];
  deletedId: number;
  constructor(private fb: FormBuilder,private permissionService:PermissionService ,
    private alertifyService: AlertifyService,
  private router: Router,
  protected translate: TranslateService,
  private ngxService: NgxUiLoaderService,
 ) {
    this.ngxService.start();
  }
  ngOnInit() {
    this.findAll();
    this.ngxService.stop();

 
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
    this.permissionService.findAll(this.resultSet.pagination, this.orderInfo, this.searchForm.value)
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



}
