/**
 * Created by osama.yousry on 22/05/2019.
 */

import {AbstractControl, ValidatorFn} from '@angular/forms';

export function isInteger(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    let isValid = false;
    if (control != null && control.value != null && control.value != '') {
      console.log(control.value);
      let x;
      isValid = isNaN(control.value) ? !1 : (x = parseFloat(control.value), (0 | x) === x);
      return isValid ?
        null : { 'invalidInteger': true};
    }
  };
}
