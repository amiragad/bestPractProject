import { Component, OnInit } from '@angular/core';
import { BaseObject } from '../../suppliers/shared/data/base-object.model';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss']
})
export class OpeningBalanceComponent implements OnInit {
  measuringUnits: BaseObject[];
  products: BaseObject[];
  productTypeKey: string;
  inventory: BaseObject[];
  constructor() { 
    
  }

  ngOnInit() {
  }

}
