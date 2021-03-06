import { Component, OnInit } from '@angular/core';
import {BreadCrumbItem} from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { clientBill } from '../../shared/data/client-bill.model';
import { client } from '../../shared/data/client.model';

@Component({
  selector: 'app-client-bills',
  templateUrl: './client-bills.component.html',
  styleUrls: ['./client-bills.component.scss']
})
export class clientBillsComponent implements OnInit {
 billsList:Array<clientBill>=new Array<clientBill>();
  constructor() { }
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.clients'},
    {url:'', label:'sideNav.clientBill'}
    ];
  ngOnInit() {
    this.getBills();
  }

  getBills()
  {
    let bill1= new clientBill();
    bill1.code="bill-102";
    bill1.clientname="احمد عامر";
    bill1.date="12/1/2019";
    bill1.discount=10;
    bill1.paid=true;
    bill1.total=200;
    bill1.type="شراء";

    bill1.totalAfterDiscount=180;
    this.billsList.push(bill1);

    
    let bill2= new clientBill();
    bill2.code="bill-103";
    bill2.clientname="احمد عامر";
    bill2.date="13/2/2019";
    bill2.discount=0;
    bill2.paid=true;
    bill2.total=1000;
    bill2.type="شراء";

    bill2.totalAfterDiscount=190;
    this.billsList.push(bill2);

    
    let bill3= new clientBill();
    bill3.code="bill-104";
    bill3.clientname="احمد عامر";
    bill3.date="30/8/2019";
    bill3.discount=20;
    bill3.paid=false;
    bill3.total=500;
    bill3.totalAfterDiscount=400;
    bill3.type="شراء";

    this.billsList.push(bill3);
    
    let bill4= new clientBill();
    bill4.code="bill-105";
    bill4.clientname="احمد عامر";
    bill4.date="22/10/2019";
    bill4.discount=50;
    bill4.paid=false;
    bill4.total=1000;
    bill4.totalAfterDiscount=500;
    bill4.type="شراء";

    this.billsList.push(bill4);


    let bill5= new clientBill();
    bill5.code="bill-106";
    bill5.clientname="احمد عامر";
    bill5.date="25/10/2019";
    bill5.discount=0;
    bill5.paid=true;
    bill5.total=5000;
    bill5.type="بيع";

    bill5.totalAfterDiscount=5000;
    this.billsList.push(bill5);

  }

}
