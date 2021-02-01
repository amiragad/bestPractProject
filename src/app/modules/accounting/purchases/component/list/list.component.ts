import { Component, OnInit } from '@angular/core';
import {BreadCrumbItem} from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { PurchaseService } from '../shared/services/purchase.service';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers:[PurchaseService]
})
export class PurchaseInvoiceListComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.purchasing'},
    {url:'', label:'sideNav.invoice.list'}
    ];
    searchForm : FormGroup = this.fb.group({
      invoiceId: [],
      ledgerNumber: [],
      invoiceDateFrom: [],
      invoiceDateTo: [],
      supplierName: [],
      inventoryName: []
    });
    resultSet: ResultSet<any> = new ResultSet<any>();
    orderInfo: OrderInfo = new OrderInfo('invoiceId', 'asc');
    id: number;
    productGroups: BaseObject[];
    collectAndManufacturs: BaseObject[];
    deletedId: number;
    constructor(
      private service: PurchaseService,
      private ngxService: NgxUiLoaderService,
      private alertifyService: AlertifyService,
      private fb: FormBuilder) {
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
      this.service.findAll(this.resultSet.pagination, this.orderInfo, this.searchForm.value)
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
  
    deleteProduct() {
        this.service.deleteById(this.deletedId).subscribe(res => {
          this.alertifyService.success('shared.deletedSuccess');
          this.findAll();
        }, error => {
          this.alertifyService.error('error.error500');
          //TODO: Use Failure Alert
        });
      
    }
    
 
  
}
