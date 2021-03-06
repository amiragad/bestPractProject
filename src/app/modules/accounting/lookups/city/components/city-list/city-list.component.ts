import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html'
})
export class CityListComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.city'}
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
