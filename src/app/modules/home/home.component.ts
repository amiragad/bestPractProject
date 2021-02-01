import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../infrastructure/services/LocalStorageService.service';
import { LoginService } from '../login/shared/services/login.service';
import { HomeService } from './shared/services/home.service';
import { Router } from '@angular/router';
import { FullRoutes } from '../../infrastructure/data/enums/angular-full-routes.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[HomeService]
})
export class HomeComponent implements OnInit {
modeules:string;
FullRoutes: typeof FullRoutes = FullRoutes;

  constructor(private localStorage:LocalStorageService, private service: HomeService,private router: Router) { }

  ngOnInit() {
   this.modeules= this.localStorage.getCurrentUser().Modules;
  }
  private loginModule(authLicense: string) {
    
    this.service.authModule(authLicense).subscribe(
      res => {
        
        this.localStorage.updateCurrentUser(res);
        // this.alertInput = new SuccessAlert();
           this.router.navigateByUrl(authLicense+"/"+this.FullRoutes.DASHBOARD);
      },
      err => {}
       
      
    );
  }
}
