/**
 * Created by osama.yousry on 21/05/2019.
 */

import {AbstractControl, ValidatorFn} from '@angular/forms';
import * as momentNs from 'moment';

export function minDateValidator(min: string, regex?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    let isValid = false;
    if (control != null && control.value != null) {
    let controlDate = momentNs(control.value);
    if (regex == null) regex = "DD/MM/YYYY";
    let minDate = momentNs(min, regex);
    isValid = controlDate.isSameOrAfter(minDate);
    }
    return isValid ?
      null : { 'minDate': true};
  };
}


export function maxDateValidator(max: string, regex?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    let isValid = false;
    if (control != null && control.value != null) {
      let controlDate = momentNs(control.value);
      if (regex == null) regex = "DD/MM/YYYY";
      let maxDate = momentNs(max, regex);
      isValid = controlDate.isSameOrBefore(maxDate);
    }
    return isValid ?
      null : { 'maxDate': true};
  };
}
