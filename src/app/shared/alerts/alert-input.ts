export class AlertInput {
  static SUCCESS_STATUS: string = 's';
  static SUCCESS_STATUS_NOT_DISAPEAR: string = 'ss';
  static FAILURE_STATUS: string = 'f';
  static WARNING_STATUS: string = 'w';

  status: string;
  errorCode: string;
  appear: boolean = false;
  data = [];

  constructor(status?: string, errorCode?: string, data?){
    this.status = status;
    this.errorCode = errorCode;
    this.data = data;

    if(this.status != null && this.errorCode != null) {
     // window.scroll(0,0);
      this.appear = true;
      // setTimeout(() => this.appear = false, 3000);
    }
  }
}
