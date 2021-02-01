import {Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {BreadCrumbItem} from '../../infrastructure/dto/BreadCrumbItem.dto';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() list: BreadCrumbItem[] = [];
  constructor() { }

  ngOnInit() {
  }

}
