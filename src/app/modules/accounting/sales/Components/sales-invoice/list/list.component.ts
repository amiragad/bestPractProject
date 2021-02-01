import { Component, OnInit } from '@angular/core';
import {BreadCrumbItem} from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ResultSet } from '../../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../../infrastructure/interfaces/list/data/order-info.model';
import { BaseObject } from '../../../../../../modules/accounting/suppliers/shared/data/base-object.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../../infrastructure/services/alertify.service';
import { SalesInvoiceService } from '../../../shared/services/sales-invoice.service';

@Component({
  selector: 'app-sales-invoice-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers:[SalesInvoiceService]
})
export class SalesInvoiceListComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sales.salesInvoice'},
    {url:'', label:'sideNav.salesInvoice.list'}
    ];
    searchForm : FormGroup = this.fb.group({
      invoiceId: [],
      ledgerNumber: [],
      invoiceDateFrom: [],
      invoiceDateTo: [],
      customerName: [],
      inventoryName: []
    });
    resultSet: ResultSet<any> = new ResultSet<any>();
    orderInfo: OrderInfo = new OrderInfo('invoiceId', 'asc');
    id: number;
    productGroups: BaseObject[];
    collectAndManufacturs: BaseObject[];
    deletedId: number;
    constructor(
      private service: SalesInvoiceService,
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
