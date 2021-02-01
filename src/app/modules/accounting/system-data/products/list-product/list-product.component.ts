import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
 import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ResultSet } from '../../../../../infrastructure/data/ResultSet';
import { OrderInfo } from '../../../../../infrastructure/interfaces/list/data/order-info.model';
import { ProductService } from '../shared/services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { productList } from '../shared/data/productList';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
  providers:[ProductService]
})
export class ListProductComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;

  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'sideNav.products.products' },
    { url: '', label: 'sideNav.products.productList' }
  ];
  searchForm : FormGroup = this.fb.group({
    code: [],
    name: [],
    collectAndManufactur: [],
    active: [],
    groupName: []
  });
  resultSet: ResultSet<productList> = new ResultSet<productList>();
  orderInfo: OrderInfo = new OrderInfo('id', 'asc');
  id: number;
  productGroups: BaseObject[];
  collectAndManufacturs: BaseObject[];
  deletedId: number;
  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder) {
    this.ngxService.start();
  }
  ngOnInit() {
    this.findAll();
    this.ngxService.stop();

    this.getProductGroup();
    this.getCollectAndManufactur();
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
    debugger
    this.productService.findAll(this.resultSet.pagination, this.orderInfo, this.searchForm.value)
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

  stopActivate() {
    this.resultSet.data.find(x => x.id == this.id).active = !this.resultSet.data.find(x => x.id == this.id).active;
  }
  activate() {
    this.productService.activate(this.id).subscribe(() => {
      this.alertifyService.success('shared.savedsuccess');
      this.findAll();
    }, error => {
      this.alertifyService.error('error.error500');
      // this.alertify.error(error);
    });
  }

  deleteProduct() {
      this.productService.deletProductById(this.deletedId).subscribe(res => {
        this.alertifyService.success('shared.deletedSuccess');
        this.findAll();
      }, error => {
        this.alertifyService.error('error.error500');
        //TODO: Use Failure Alert
      });
    
  }
  
  getProductGroup() {
    this.productService.getLookup('ProductGroup')
      .subscribe((res: BaseObject[]) => {
        this.productGroups = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }

  getCollectAndManufactur() {
    this.productService.getLookup('CollectAndManufactur')
      .subscribe((res: BaseObject[]) => {
        this.collectAndManufacturs = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }

}
