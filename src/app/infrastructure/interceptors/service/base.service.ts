import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ServerUrl } from './server-url.model';
import { AvilableServersEnum } from '../../../../environments/configuration/avilable-servers.enum';
import { avilableServers } from '../../../../environments/configuration/avilable-servers';
import { ServerApiUrlTest } from '../../../../environments/configuration/environment.test';
import { ServerApiUrlDev } from '../../../../environments/configuration/environment.dev';
import { ServerApiUrlProd } from '../../../../environments/configuration/environment.prod';
import { GlobalVariables } from '../../data/enums/global-variables.enum';
import { AuthUser } from '../../dto/auth-user.model';
import { LocalStorageService } from '../../services/LocalStorageService.service';
import { FullRoutes } from '../../data/enums/angular-full-routes.enum';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class BaseService {
    private currentUser: string = 'currentUser';
    User: AuthUser;

    protected _avilableServers: AvilableServersEnum = avilableServers;
    protected backendServerUrl: ServerUrl;
    ROUTES: typeof FullRoutes = FullRoutes;

    protected options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept-Language': 'ar'
        })
    };
    contenttype: string;

    constructor(
        private _http: HttpClient,
        private router: Router,
        private localStService: LocalStorageService,
        private _translateService: TranslateService
    ) {
        this.setBackendServerUrl();
    }

    private setBackendServerUrl(): void {
        if (this._avilableServers == AvilableServersEnum.ApiUrlDev) {
            this.backendServerUrl = ServerApiUrlDev;
        }
        else if (this._avilableServers == AvilableServersEnum.ApiUrlTest) {
            this.backendServerUrl = ServerApiUrlTest;
        }
        else if (this._avilableServers == AvilableServersEnum.ApiUrlProd) {
            this.backendServerUrl = ServerApiUrlProd;
        }
    }
    private setOptions() {
        
        let contentType: string = 'application/json';
        let lang = this.localStService.getCurrentLanguage();
        this.User = JSON.parse(localStorage.getItem(this.currentUser));
        let userId = this.localStService.getCurrentUserId();

        if (userId) {
            this.options = {
                headers: new HttpHeaders({
                   /*  'Content-Type': contentType, */
                    'Accept-Language': lang,
                     'user-id': userId,
                    'token': this.localStService.getCurrentToken() 
                })
            };
        }
        else {
            this.options = {
                headers: new HttpHeaders({
                 /*    'Content-Type': contentType, */
                    'Accept-Language': lang
                })
            };
        }
    }

    protected getAllData<T>(url: string): Observable<T> {
        let fullUrl: string = `${url}`;
        //debugger;
        this.setOptions();
        return this._http.get(fullUrl, this.options)
            .pipe(
                tap(_ => console.log(`data fetched.`)),
                catchError(this.handleError<any>('getAll', []))
            );
    }
    protected getData<T>(url: string,params:HttpParams): Observable<T> {
        let fullUrl: string = `${url}`;
        
        this.setOptions();
        const options = { params: params, headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept-Language': 'ar'
        }) };
        return this._http.get(fullUrl, options)
            .pipe(
                tap(_ => console.log(`data fetched.`)),
                catchError(this.handleError<any>('get', []))
            );
    }
    protected get<T>(url: string): Observable<T> {
        let fullUrl: string = `${url}`;
        //debugger;
        this.setOptions();

        return this._http.get(fullUrl, this.options)
            .pipe(
                tap(_ => console.log(`data fetched.`)),
                catchError(this.handleError<any>('get', []))
            );
    }
    protected postData<T>(url: string, item: any, header?: any): Observable<T> {
       
        
        this.setOptions();
        //debugger;
        return this._http.post(url, item, this.options)
            .pipe(
                tap(_ => console.log(`response fetched.`)),
                catchError(this.handleError<any>('postData', []))
            );
    }

    protected putData<T>(url: string, item: any): Observable<T> {
        let fullUrl: string = `${url}`;
        //debugger;
        this.setOptions();

        return this._http.put(fullUrl, item, this.options)
            .pipe(
                tap(_ => console.log(`response fetched.`)),
                catchError(this.handleError<any>('putData', []))
            );
    }
    protected deleteData<T>(url: string): Observable<T> {
        let fullUrl: string = `${url}`;
        //debugger;
        this.setOptions();

        return this._http.delete(fullUrl, this.options)
            .pipe(
                tap(_ => console.log(`response fetched.`)),
                catchError(this.handleError<any>('deleteData', []))
            );
    }

    public getEnvironmentApiUrl(): ServerUrl {
        return this.backendServerUrl;
    }


    /*End Authentication region */
    /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
           
            let paramString: string;
            if (error &&
                error.status == GlobalVariables.InvalidLoginCode) {
                //debugger
                this.localStService.clearAuthData();
                paramString = 'unauthorized';
                this.router.navigate([this.ROUTES.LOGIN], {
                    queryParamsHandling: 'merge',
                    queryParams: { error: paramString }
                });
                return of();
            }
            else if (error.status == 401) {
                this.localStService.clearAuthData();
                paramString = 'unauthorized';
                this.router.navigate([this.ROUTES.LOGIN], {
                    queryParamsHandling: 'merge',
                    queryParams: { error: paramString }
                });
                console.error(JSON.stringify(error));
            }
            else {
                // TODO: send the error to remote logging infrastructure
                console.error(JSON.stringify(error)); // log to console instead

                // TODO: better job of transforming error for user consumption
                console.error(`${operation} failed: ${error.message}`);

                throw error;
                // Let the app keep running by returning an empty result.
                //return of(result as T);
            }
        };
    }

}