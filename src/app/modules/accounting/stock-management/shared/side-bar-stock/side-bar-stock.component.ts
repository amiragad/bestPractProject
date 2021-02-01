import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
@Component({
  selector: 'app-side-bar-stock',
  templateUrl: './side-bar-stock.component.html'
})
export class SideBarStockComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;
  constructor() { }

  ngOnInit() {

    $('.sideNav li a').click(function () {
      $(this).parent().children("ul").toggle('slow');
    })
  }

  
}
