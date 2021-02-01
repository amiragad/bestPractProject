import {AlertInput} from "./alert-input";


export class SuccessAlert extends AlertInput{
  constructor(localKey?: string, data?){
    super('s',
    (localKey == null ? 'shared.processSuccessful' : localKey), data);
  }
}
