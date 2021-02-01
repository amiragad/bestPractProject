import {FormGroup} from "@angular/forms";
import * as momentNs from 'moment';
import {Moment} from "moment";
import { ConfigParam } from "../data/dto/ConfigParam";

export class Utils {
  private static moment = momentNs;
  static clone<T>(instance: T): T {
    const copy = new (instance.constructor as { new(): T })();
    Object.assign(copy, instance);
    return copy;
  }

  static cloneList<T>(instance: T[]): T[] {
    let list: T[] = [];

    if (instance != null && instance.length != 0)
      for (let i = 0; i < instance.length; i++)
        list.push(Utils.clone<T>(instance[i]));

    return list;
  }

  static addIfNotFoundByID<T>(array: T[], item: T): T[] {
    let found: boolean = false;
    for (let i = 0; i < array.length; i++)
      if (array[i]['id'] == item['id']) {
        found = true;
        break;
      }

    if (!found)
      array.push(item);
    return array;
  }

  static markControlsDirty(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];

      if (abstractControl instanceof FormGroup) {
        this.markControlsDirty(abstractControl);
      } else {
        abstractControl.markAsTouched();
        abstractControl.markAsDirty();
      }
    });
  }

  static changeDateFormat(dateStr: string, fromFormat: string, toFormat: string){
    if(fromFormat == ConfigParam.MOMENT_DATE_FORMAT){
      let day = dateStr.split('/')[0];
      let month = dateStr.split('/')[1];
      let year = dateStr.split('/')[2];
      if(toFormat == ConfigParam.SQL_DATE_FORMAT)
        return year + '-' + month + '-' + day;
    }
    return dateStr;
  }

  static dateStrToMoment(dateStr: string){
    return dateStr != null ? this.moment(new Date(dateStr)) : null;
  }
  static momentToDateStr(dateMoment: Moment){
    return dateMoment != null ? dateMoment.format(ConfigParam.DISPLAY_MOMENT_DF) : null;
  }
  static dateToMoment(date: Date){
    return date != null ? this.moment(date): null;
  }

  static hasValue(value){
    return (value != null) && (typeof value === 'string' && value.trim() != '');
  }
  static hasValueAndIsNumber(value){
    return this.hasValue(value) && !isNaN(parseInt(value));
  }
}



