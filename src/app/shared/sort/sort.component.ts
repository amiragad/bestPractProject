import {Component, EventEmitter, OnInit, Output, Input, SimpleChanges, SimpleChange} from '@angular/core';


@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit {

  @Output() sortAsc: EventEmitter<void> = new EventEmitter<void>();
  @Output() sortDesc: EventEmitter<void> = new EventEmitter<void>();
 isAsc:boolean=true;
 isDesc:boolean=true;
 @Input() currentOrder:string;
 @Input() orderBy:string;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    const currentorderby: SimpleChange = changes.currentOrder;
    if(currentorderby!=undefined)
    if(currentorderby.currentValue!=undefined)
    this.currentOrder=currentorderby.currentValue;
  }
  sort(order: string){
    let dd=this.orderBy;
    let s=this.currentOrder;
    debugger

    if(order.toLowerCase() === 'asc')
    {
      this.sortAsc.emit();
      this.isDesc=false;
      this.isAsc=true;
    }
    
    else if(order.toLowerCase() === 'desc')
    {
      this.sortDesc.emit();
      this.isDesc=true;
      this.isAsc=false;
    }
    else if(order.toLocaleLowerCase()=='unsorted')
    {
      this.isDesc=true;
      this.isAsc=true;
    }
  }

}
