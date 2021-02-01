import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-stock-income',
  templateUrl: './stock-income.component.html'
})
export class StockIncomeComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.stock'},
    {url:'', label:'sideNav.stockIncome'}
  ];
  list: any[] = [ 
    {
    "total": 50,
    "id": 1,
    "brand": "تيليفون -5",
    "unit": "كرتونة",
    "price": 10.00,
    "quantity": 11.0,
    "discount": 2.00,
    "expenses": 5.00,
    "totalDiscount": 5.00,
    "netValue": 108.00
    }, 
    {
    "total": 35,
    "id": 2,
    "brand": "3 - لابتوب",
    "unit": "كرتونة",
    "price": 10.00,
    "quantity": 11.0,
    "discount": 2.00,
    "expenses": 7.00,
    "totalDiscount": 8.00,
    "netValue": 150.00
    },
    {
    "total":89,
    "id": 3,
    "brand": "3 - شاشة",
    "unit": "كرتونة",
    "price": 350000,
    "quantity":1.0,
    "discount": 200.00,
    "expenses": 20.00,
    "totalDiscount": 200.00,
    "netValue": 108.00
    },
    {
    "total":62,
    "id": 4,
    "brand": "3 - سماعة",
    "unit": "كرتونة",
    "price": 175.00,
    "quantity": 5.0,
    "discount": 2.00,
    "expenses": 5.00,
    "totalDiscount": 5.00,
    "netValue": 100.00
    },
    {
    "total": 50,
    "id": 12,
    "brand": "3 - لابتوب",
    "unit": "كرتونة",
    "price": 10.00,
    "quantity": 11.0,
    "discount": 2.00,
    "expenses": 5.00,
    "totalDiscount": 5.00,
    "netValue": 108.00
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
