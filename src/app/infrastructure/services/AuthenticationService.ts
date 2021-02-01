import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {User} from '../data/dto/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './LocalStorageService.service';


@Injectable()
export class AuthenticationService {
  static requiredPath: string = null;
  static loggingEmitter = new EventEmitter<Boolean>();
  private static _currentUser: User = null;
  constructor(private _router: Router, private _http: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelperService: JwtHelperService
    ) {
  }
  static isLoggedInBefore() {
    if (localStorage.getItem(window.location.hostname+'loginUser') === null) {
      AuthenticationService._currentUser = null;
    } else {
      AuthenticationService.loggedIn(JSON.parse(localStorage.getItem(window.location.hostname+'loginUser')));
    }
  }

  static isLoggedIn() {
    return (AuthenticationService._currentUser != null) ? true : false;
  }

  static loggedIn(value: User) {
    if (value != null) {
      AuthenticationService._currentUser = value;
      AuthenticationService.loggingEmitter.emit(true);
      localStorage.setItem(window.location.hostname+'loginUser', JSON.stringify(AuthenticationService._currentUser));
    }
  }

  loggedIn() {
    const token =  this.localStorageService.getCurrentToken();
    if (!token) {
      return false;
    }

    return !this.jwtHelperService.isTokenExpired(token);

  }

  static getCurrentUser(): User {
    return AuthenticationService._currentUser;
  }

  obtainAccessToken() {
  }

}
