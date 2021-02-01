import { Component, OnInit } from '@angular/core';
import {BreadCrumbItem} from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { client } from '../../shared/data/client.model';
import { clientEnum } from '../../shared/data/client.enum';
import { Product } from '../../../system-data/products/shared/data/product';

@Component({
  selector: 'app-client-accounts',
  templateUrl: './client-accounts.component.html',
  styleUrls: ['./client-accounts.component.scss']
})
export class clientAccountsComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.clients'},
    {url:'', label:'sideNav.clientAccounts'}
    ];

    clientsList:Array<client>=new Array<client>();
 
   model;

  items: number [] = [];

  tempArray: number[] = [];
  config: any;
    productsList:Array<Product>=new Array<Product>();
   constructor() {
    this.config = {
      currentPage: 1,
      itemsPerPage: 5
    };
  }


  pageChanged(page){
    this.config.currentPage = page;
  }
 

  

  ngOnInit() {
this.getclients();

for(var i=0; i<5; i++){
  this.tempArray.push(i);
}
for (var x=0; x<100; x++){
  this.items.push(x);
}
  }

  getclients()
  {
    let client1:client=new client();
    client1.id=1;
    client1.code="apex-1";
    client1.name="احمد عامر";
    client1.type="عميل";
    client1.cridtortOrDebitor=clientEnum.cridtor;
    client1.clientclassification="A";
    client1.status=false;
    client1.amount=203.70
    this.clientsList.push(client1);
  
    let client2:client=new client();
    client2.id=1;
    client2.code="apex-2";
    client2.name="احمد حجازي";
    client2.type="عميل مورد";
    client2.cridtortOrDebitor=clientEnum.debitor;
    client2.clientclassification="b";
    client2.status=true;
    client2.amount=7896.70
    this.clientsList.push(client2);
   
    let client3:client=new client();
    client3.id=1;
    client3.code="apex-3";
    client3.name="سارة سالم";
    client3.type="مورد";
    client3.cridtortOrDebitor=clientEnum.debitor;
    client3.clientclassification="c";
    client3.status=true;
    client3.amount=3000.70
    this.clientsList.push(client3);


    let client4:client=new client();
    client4.id=1;
    client4.code="apex-4";
    client4.name="احمد جمال";
    client4.type="عميل مورد";
    client4.cridtortOrDebitor=clientEnum.debitor;
    client4.clientclassification="a";
    client4.status=false;
    client4.amount=3000
    this.clientsList.push(client4);

    let client5:client=new client();
    client5.id=1;
    client5.code="apex-5";
    client5.name="محمد فاروق";
    client5.type="مورد";
    client5.cridtortOrDebitor=clientEnum.debitor;
    client5.clientclassification="a";
    client5.status=false;
    client5.amount=503000.95
    this.clientsList.push(client5);
 

  }

}
