import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, HostListener} from "@angular/core";
import {AlertInput} from "./alert-input";

@Component({
  selector: 'app-alert',
  template: `
  <div class="col-md-12 alert alert-danger" *ngIf="alertInput?.appear"
            [ngClass]="{
          'alert-success': alertInput.status == 's' || alertInput.status == 'ss',
          'alert-danger': alertInput.status == 'f'|| alertInput.status == 'ff',
          'alert-warning': alertInput.status == 'w'|| alertInput.status == 'ww'
          }">
    <span role="alert" class="alert-dismissible fade show h4" >
      <!--{{alertInput.errorCode | translate:
        (alertInput.data != null && alertInput.data.length != 0 ? alertInput.data[0] : [])}}-->
      {{ alertInput.errorCode | translate: alertInput.data }}
    <button type="button" class="close" (click)="onCloseAlert()">
      <span aria-hidden="true" class="fa fa-times"></span>
    </button>
  </span>
</div>
  `
})
export class AlertComponent implements OnInit, OnChanges {
  @Input() alertInput: AlertInput;
  @Output() successClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor(){
  }

  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.alertInput != null){
      this.alertInput = changes.alertInput.currentValue;
   }
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.alertInput.appear){
    this.alertInput.appear = false;
    this.successClosed.emit();
}
  }
  onCloseAlert(){
    this.alertInput.appear = false;
  }
}
