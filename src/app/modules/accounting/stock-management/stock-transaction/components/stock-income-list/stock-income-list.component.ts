import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-stock-income-list',
  templateUrl: './stock-income-list.component.html'
})
export class StockIncomeListComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.stock'},
    {url:'', label:'sideNav.stockIncomeList'}
    ];
  model;
  tempArray: number[] = [];
  constructor() { }

  ngOnInit() {
  }

}
