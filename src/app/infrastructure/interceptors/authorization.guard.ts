import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import { LocalStorageService } from '../services/LocalStorageService.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private localStorageService: LocalStorageService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   
                if (route.data.view != null) {
      if (this.localStorageService.getCurrentUser().views.map(v => v.toLowerCase()).findIndex( x => x == route.data.view.toLowerCase()) !== -1)
        return true;
      else
        this.router.navigate(['/403']);
    } else if (route.data.action != null) {
      if (this.localStorageService.getCurrentUser().actions.map(v => v.toLowerCase()).includes(route.data.action != null ?
          route.data.action.toLowerCase() : null))
        return true;
      else
        this.router.navigate(['/403']);
    } else
      this.router.navigate(['/403']);
  }


}
