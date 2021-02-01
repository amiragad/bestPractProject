import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-measruing-unit-list',
  templateUrl: './measruing-unit-list.component.html'
})
export class MeasruingUnitListComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.measruingUnit'}
    ];
  model;

  
  items: number [] = [];

  tempArray: number[] = [];
  config: any;

  constructor() {
    this.config = {
      currentPage: 1,
      itemsPerPage: 5
    };
  }

  ngOnInit() {
    for(var i=0; i<5; i++){
      this.tempArray.push(i);
    }
  for (var x=0; x<100; x++){
      this.items.push(x);
  }

  }
  pageChanged(page){
    this.config.currentPage = page;
  }

}
