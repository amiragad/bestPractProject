import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './LocalStorageService.service';
declare let alertify: any;
@Injectable()
export class AlertifyService {

constructor( protected translate: TranslateService, private localStorageService: LocalStorageService) { 
  
 
}
confirm(title: string, message: string,oncancel: string, okCallback: () => any) {
    alertify.confirm(title,message, function(e) {
      if (e) {
        okCallback();
      } else {
      }
    },function(){alertify.success(oncancel) });
  }

  success(message: string) {
  /*   if(this.localStorageService.getCurrentLanguage()=='ar')
    alertify.set('notifier','position', 'bottom-left');
    else */
    alertify.set('notifier','position', 'bottom-right');
    this.translate.get(message).subscribe(res => {
      alertify.success(res);
    });
  }

  error(message: string) {
    /* if(this.localStorageService.getCurrentLanguage()=='ar')
    alertify.set('notifier','position', 'bottom-center');
    else */
    alertify.set('notifier','position', 'bottom-right');
    this.translate.get(message).subscribe(res => {
      alertify.error(res);
    });
  }

  warning(message: string) {
    this.translate.get(message).subscribe(res => {
      alertify.warning(res);
    });
  }

  message(message: string) {
    alertify.message(message);
    
  }
}
