import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from "../../infrastructure/services/LocalStorageService.service";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormValidators } from '../../infrastructure/common/form-validators';
import { LoginService } from './shared/services/login.service';
import { LoginDTO } from './shared/data/login.model';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { AlertifyService } from '../../infrastructure/services/alertify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[LoginService,JwtHelperService]
})
export class LoginComponent implements OnInit {

  formData: FormGroup = this.formBuilder.group({
    username: [null, [Validators.required, Validators.maxLength(50), FormValidators.emptyStr]],
    password: [null, [Validators.required, Validators.maxLength(50), FormValidators.emptyStr]]
  });
  currentLang: string;
  langElement: any;
  authUser: any;
  username: any;
  password: any;
  constructor(@Inject(DOCUMENT) private document,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    protected router: Router,
    private formBuilder: FormBuilder
    , private jwtHelperService: JwtHelperService,
    private service: LoginService,private alertifyService: AlertifyService) {


    this.currentLang = this.localStorageService.getCurrentLanguage();
  }

  ngOnInit() {
  }

  onChangeLang(lang: string) {
    this.localStorageService.setLang(lang);
    this.translateService.use(lang);
    this.translateService.setDefaultLang(lang);
    this.currentLang = lang;
    this.document.getElementById('lang-style').setAttribute('href', this.currentLang + '.bundle.css');
  }


  login() {
    if(this.formData.valid){
      let data:LoginDTO=new LoginDTO();
      data.userName = this.formData.get('username').value;
      data.password = this.formData.get('password').value;
      
      this.service.login(data).subscribe(
        res => {
          this.authUser = Object.assign({}, this.jwtHelperService.decodeToken(res.token));
          this.localStorageService.setCurrentToken(res.token);
          this.localStorageService.setCurrentUser(this.authUser);
          this.router.navigateByUrl('home');
        },
        err => { 
          console.log(err);
          this.alertifyService.error('error.error'+err.status);
        }
      );
  
    }
    else{
      this.fireValidation();
    }
   
  }
  fireValidation() {
   this.formData.get('username').markAsTouched();
   this.formData.get('password').markAsTouched();

  }
}
