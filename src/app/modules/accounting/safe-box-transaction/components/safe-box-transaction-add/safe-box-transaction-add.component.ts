import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-safe-box-transaction-add',
  templateUrl: './safe-box-transaction-add.component.html'
})
export class SafeBoxTransactionAddComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.safeBox'},
    {url:'', label:'sideNav.addSafeBoxTrans'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
