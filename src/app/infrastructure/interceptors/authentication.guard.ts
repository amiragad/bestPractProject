import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/LocalStorageService.service';
import { AuthenticationService } from '../services/AuthenticationService';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private localStorageService: LocalStorageService, private router: Router, private authService : AuthenticationService){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.loggedIn() && this.localStorageService.getCurrentUser() != null &&
        this.localStorageService.getCurrentUser().sessionID != null)
      return true;
    else
      this.router.navigate(['/login']);
  }
}
