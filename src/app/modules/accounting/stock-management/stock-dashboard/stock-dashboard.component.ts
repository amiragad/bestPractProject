import { Component, OnInit } from '@angular/core';
import {BreadCrumbItem} from "../../../../infrastructure/dto/BreadCrumbItem.dto";

@Component({
  selector: 'app-stock-dashboard',
  templateUrl: './stock-dashboard.component.html'
})
export class StockDashboardComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'stockManagement.title'},
    {url:'', label:'stockManagement.dashboard'}
  ];
  colorScheme = {
    domain: ['#ff4848',
      '#0267fd',
      '#8dd35f']
  };
  colorScheme2 = {
    domain: [
      '#8dd35f',
      '#0267fd',
      '#ff4848'

      ]
  };

  graphData = [
    {
      "name": "Jan",
      "series": [
        {
          "name": "المشتريات",
          "value": 10
        },
        {
          "name": "المبيعات",
          "value": 40
        },
        {
          "name": "عدد العملاء",
          "value": 50
        }
      ]
    },

    {
      "name": "Feb",
      "series": [
        {
          "name": "المشتريات",
          "value": 40
        },
        {
          "name": "المبيعات",
          "value": 30
        },
        {
          "name": "عدد العملاء",
          "value": 30
        }
      ]
    },
    {
      "name": "Mar",
      "series": [
        {
          "name": "المشتريات",
          "value": 20
        },
        {
          "name": "المبيعات",
          "value": 20
        },
        {
          "name": "عدد العملاء",
          "value": 60
        }
      ]
    }
  ];

  pieChartData =[
    {
      "name": "المشتريات",
      "value": 33.3
    },
    {
      "name": "المبيعات",
      "value": 66.7
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
