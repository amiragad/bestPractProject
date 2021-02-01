import {Component, Inject, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from '../../infrastructure/services/LocalStorageService.service';
import {DOCUMENT} from '@angular/common';
import * as $ from "jquery";
import { AuthUser } from '../../infrastructure/dto/auth-user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentLang: string;
  langElement: any;
  @Input() showMenu: boolean = true;
  user: AuthUser;
  constructor(@Inject(DOCUMENT) private document,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService) {


    this.currentLang = this.localStorageService.getCurrentLanguage();
  }

  ngOnInit() {
    this.user = this.localStorageService.getCurrentUser();
  }

  onChangeLang(lang: string) {
    this.localStorageService.setLang(lang);
    this.translateService.use(lang);
    this.translateService.setDefaultLang(lang);
    this.currentLang=lang;
    this.document.getElementById('lang-style').setAttribute('href', this.currentLang + '.bundle.css');
  }
  openNav(){
    $('.sideNav').toggleClass('opened') ;
    $('.main-content').toggleClass('menu-opened');
  }


}
