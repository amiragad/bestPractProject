import { Component, OnInit } from '@angular/core';
import {BreadCrumbItem} from '../../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-rebate-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PurchaseRebateListComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.purchasing'},
    {url:'', label:'sideNav.rebate.list'}
    ];
  model;

  list: any[] = [
    {
      "id": 1,
      "code": "apex-1",
      "vendorInvoiceCode":1,
      "vendor": "مازن حسن",
      "inventory": "مخزن الاسكندرية",
      "date": "2019-01-08T19:51:34.007"
    },
    {
      "id": 2,
      "code": "apex-2",
      "vendorInvoiceCode":2,
      "vendor":"محمد فاروق",
      "inventory": "مخزن القاهرة",
      "date": "2019-09-10T19:51:34.007"
    },
    {
      "id": 3,
      "code": "apex-3",
      "vendorInvoiceCode":3,
      "vendor": "احمد جمال",
      "inventory": "مخزن الاسكندرية",
      "date": "2019-03-08T19:51:34.007"
    }, {
      "id": 4,
      "code": "apex-4",
      "vendorInvoiceCode":4,
      "vendor": "مازن حسن",
      "inventory": "مخزن الاسكندرية",
      "date": "2019-06-08T19:51:34.007"
    },
    {
      "id": 5,
      "code": "apex-5",
      "vendorInvoiceCode":5,
      "vendor": "احمد حجازي",
      "inventory": "مخزن الاسكندرية",
      "date": "2019-09-08T19:51:34.007"
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
