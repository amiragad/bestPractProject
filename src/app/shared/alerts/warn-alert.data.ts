import {AlertInput} from "./alert-input";

export class WarnAlert extends AlertInput{
  constructor(localKey: string, data?: string[]){
    super('w', localKey, data);
  }
}
