import {Component, Inject, OnInit} from '@angular/core';
import * as $ from "jquery";
import {LocalStorageService} from './infrastructure/services/LocalStorageService.service';
import {TranslateService} from '@ngx-translate/core';
import {DOCUMENT} from '@angular/common';
import { Router } from '@angular/router';
import { Languages } from './infrastructure/data/enums/language.enum';


export class DatepickerOverviewExample {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'Apex';
  langElement: any;
  lang: Languages;

  constructor(@Inject(DOCUMENT) private document,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService,protected router: Router) {
    this.translateService.addLangs(['ar', 'en']);
    if (this.localStorageService.getCurrentLanguage() == null)
      this.localStorageService.setLang('ar');
     translateService.setDefaultLang(this.localStorageService.getCurrentLanguage());
  }

  ngOnInit() {
    this.langElement = document.createElement('link');
    this.langElement.id = 'lang-style';
    //this.langElement.href = 'ar.bundle.css';
    this.langElement.type = 'text/css';
    this.langElement.rel = 'stylesheet';
    //console.log(this.langElement);
    document.getElementsByTagName('head')[0].appendChild(this.langElement);
  // let lang= this.localStorageService.getCurrentLanguage();
   if (this.localStorageService.getCurrentLanguage() != null) {
    this.lang = this.localStorageService.getCurrentLanguage();
    this.translateService.setDefaultLang(this.localStorageService.getCurrentLanguage());
  }
    this.document.getElementById('lang-style').setAttribute('href', this.lang+ '.bundle.css');
    //this.router.navigate(["login"]);
  }


}
