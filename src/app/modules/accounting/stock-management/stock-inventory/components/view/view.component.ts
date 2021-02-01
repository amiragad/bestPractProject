import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.stock'},
    {url:'', label:'sideNav.viewStock'}
  ];
  list: any[] = [ 
    {
    "code": 1,
    "brand": "تيليفون -5",
    "spendQuantity": 5,
    "restQuantity": 10,
    "totalQuantity": 15
    }, 
    {
      "code": 2,
      "brand": "تلاجه -5",
      "spendQuantity": 15,
      "restQuantity": 20,
      "totalQuantity": 35
      }, 
      {
        "code": 3,
        "brand": "تلفزيون -5",
        "spendQuantity": 5,
        "restQuantity": 10,
        "totalQuantity": 15
        }, 
        {
          "code": 4,
          "brand": "شاشه -5",
          "spendQuantity": 5,
          "restQuantity": 10,
          "totalQuantity": 15
          }, 
          {
            "code": 5,
            "brand": "لاب توب ",
            "spendQuantity": 5,
            "restQuantity": 10,
            "totalQuantity": 15
            }
  ];
  constructor() { }

  ngOnInit() {
  }

}
