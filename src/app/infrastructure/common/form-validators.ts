import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import * as momentNs from 'moment';

export class FormValidators {

  static moment = momentNs;
  constructor(){

  }

  static fromToDates = (control: AbstractControl): { [key: string]: boolean } => {
    let startDate: string = null;
    let startYear: string = control.get('start').value != null ? control.get('start').value.year : '';
    let startMonth: string = control.get('start').value != null ? control.get('start').value.month : '';
    let startDay: string = control.get('start').value != null ? control.get('start').value.day : '';

    let endDate: string = null;
    let endYear: string = control.get('end').value != null ? control.get('end').value.year : '';
    let endMonth: string = control.get('end').value != null ? control.get('end').value.month : '';
    let endDay: string = control.get('end').value != null ? control.get('end').value.day : '';

    if (parseInt(startDay) < 10)
      startDay = '0' + startDay;
    if (parseInt(startMonth) < 10)
      startMonth = '0' + startMonth;

    if (parseInt(endDay) < 10)
      endDay = '0' + endDay;
    if (parseInt(endMonth) < 10)
      endMonth = '0' + endMonth;

    if (control.get('start').value != null)
      startDate = startYear + '-' + startMonth + '-' + startDay;

    if (control.get('end').value != null)
      endDate = endYear + '-' + endMonth + '-' + endDay;

    let valid: boolean = startDate <= endDate;
    if (control.get('start').value == null || control.get('end').value == null)
      valid = true;
    return (!valid) ? {notInSequence: true} : null;
  };

  static emptyStr = (control: AbstractControl): { [key: string]: boolean } => {
    let content: string = control.value;
    let valid: boolean = true;

    if (content != null)
      valid = !/^( |&nbsp;|\n|\r|\t)+$/.test(content);

    return (!valid) ? {emptyStr: true} : null;
  };

  static notDecimal = (control: AbstractControl): { [key: string]: boolean } => {
    let content: string = control.value;
    let valid: boolean = true;
    let contentNum: number = parseFloat(content);
    if (isNaN(contentNum))
      valid = false;
    if (contentNum % 1 != 0)
      valid = false;

    return (!valid) ? {decimal: true} : null;
  };
  static validNumber = (control: AbstractControl): { [key: string]: boolean } => {
    let content: any = control.value;
    let valid: boolean = true;
    if (content === null || content === '') return null;
    if (!content.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'invalidNumber': true };
    return null;
  };

  static validEmail = (control: AbstractControl): { [key: string]: boolean } => {
    let content: string = control.value;
    let valid: boolean = true;

    if (content != null) {
      valid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(content);
      if (!valid)
        return {invalidEmail: true};
    }
    return null;
  };

  static inFuture = (control: AbstractControl): { [key: string]: boolean } => {
    let startVal = FormValidators.moment(new Date());
    let endVal = control.value;
    if(endVal != null)
      endVal = FormValidators.moment(new Date(endVal.format('l')));

    let valid: boolean = true;


    if(startVal != null && endVal != null) {
      valid = ( (startVal <= endVal) ||
        (startVal.format("DD-MM-YYYY") == endVal.format("DD-MM-YYYY")) ) ;
    }

    return (!valid) ? {notInFuture: true} : null;
  };

  static inPast = (control: AbstractControl): { [key: string]: boolean } => {
    let startVal = FormValidators.moment(new Date());
    let endVal = control.value;
    if(endVal != null)
      endVal = FormValidators.moment(new Date(endVal.format('l')));

    let valid: boolean = true;
    if(startVal != null && endVal != null)
      valid = startVal >= endVal;

    return (!valid) ? {notInPast: true} : null;
  };

  static fromToNumbers = (control: AbstractControl): { [key: string]: boolean } => {
    // if(control.get('min') == null || control.get('max') == null )
    //   return null;

    let minValue: number = control.get('min').value != null ? control.get('min').value : 0;
    let maxValue:number = control.get('max').value != null ? control.get('max').value : 0;
    let valid: boolean;
    if(minValue <= maxValue) {
      valid =true ;
    }
    return (!valid) ? {maxSTMin: true} : null;
  };

  static formDataValidate  = (control: AbstractControl): { [key: string]: boolean } => {

    let newRow: FormGroup = <FormGroup>control.get('currentRow');
    let formArray: FormArray = <FormArray>control.get('formArray');
    let minValues: number[] =[];
    let maxValues: number[] =[];
    for(let item of formArray.controls ){
      let min :number = item.get('min').value ;
      let max :number = item.get('max').value ;
      let empPercentage:number =item.get('employeesPercentage').value ;
      minValues.push(min) ;
      maxValues.push(max) ;
    }
    if(newRow.get('min') != null && newRow.get('max') != null &&newRow.get('employeesPercentage') != null) {
      minValues.push(newRow.get('min').value);
      maxValues.push(newRow.get('max').value);
    }else {
      return null ;
    }
    //Check if there is overlap
    for(let i = 1 ; i< minValues.length;i++) {
      if((minValues[i]) <= (maxValues[i-1])) {
        return {overlap: true};
      }
    }
    //Check if there is gap
    for(let i = 1 ; i< minValues.length;i++) {
      if((minValues[i]) -(maxValues[i-1])>=1) {
        return {gap: true};
      }
    }
    return null;
  };

  static formArrayValidate  = (control: AbstractControl): { [key: string]: boolean } => {

    let formArray: FormArray = <FormArray>control;
    let minValues: number[] =[];
    let maxValues: number[] =[];
    for(let item of formArray.controls ){
      let min :number = item.get('min').value ;
      let max :number = item.get('max').value ;
      let empPercentage:number =item.get('employeesPercentage').value ;
      minValues.push(min) ;
      maxValues.push(max) ;
    }
    let valid :boolean = true;
    //Check if there is overlap
    for(let i = 1 ;i< minValues.length;i++) {
      if((minValues[i]) <= (maxValues[i-1])) {
        return {overlap: true};
      }
    }
    //Check if there is gap
    for(let i = 1 ; i< minValues.length;i++) {
      if((minValues[i]) -(maxValues[i-1])>=1) {
        return {gap: true};
      }
    }
    return null;
  };
}
