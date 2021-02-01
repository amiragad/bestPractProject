import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthViews} from "./data/auth-view.model";
import { LocalStorageService } from '../../services/LocalStorageService.service';

@Directive({
  selector: '[authorizeView]'
})
export class AuthorizeViewDirective implements OnInit {
  authViews: string [];

  constructor(private templateRef: TemplateRef<any>,
              private viewContainerRef: ViewContainerRef,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {

  }

  @Input()
  set authorizeView(viewList: AuthViews[]) {
    if (viewList != undefined && viewList != null && viewList.length != 0) {
      this.authViews = this.localStorageService.getUserViews();
      let found = false;

      for(let i=0; i< viewList.length; i++) {
        if (this.authViews.includes(viewList[i])) {
          found = true;
          break;
        }
         else
          this.viewContainerRef.clear();
      }
      if (found)
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      else
        this.viewContainerRef.clear();
    }
  }
}
