import { AuthUser } from "../dto/auth-user.model";
import { Languages, getLang } from "../data/enums/language.enum";
import { debug } from "util";
import { LoginModule } from "../../modules/home/shared/data/login-module.model";

export class LocalStorageService {
  
  setCurrentToken(token: string) {
    localStorage.setItem(this.TOKEN, token);
  }
  setCurrentUser(authUser: AuthUser) {
    if(authUser.views == undefined)
      authUser.views = [];
    if(authUser.actions == undefined)
      authUser.actions = [];
    localStorage.setItem(this.AUTH_USER, JSON.stringify(authUser));
  }
  CURRENT_LANGUAGE: string = "ar";
  PREFIX: string = "Apex-";
  AUTH_USER: string = this.PREFIX + 'AUTH-USER';
  CURRENT_LANG: string = this.PREFIX + 'LANG';
  TOKEN: string = this.PREFIX + 'TOKEN';

  setLang(lang: string){
    this.CURRENT_LANGUAGE = lang;
    localStorage.setItem(this.CURRENT_LANG, lang);
  }

  getCurrentUserId(): string {
    let json: string = localStorage.getItem(this.AUTH_USER);
    let authUser: AuthUser;

    if(json != null)
      authUser = JSON.parse(json);
    if(authUser==undefined)
    return null;
    return authUser.UserId.toString();
  }

  getCurrentUser(): any {
    let json: string = localStorage.getItem(this.AUTH_USER);
    let authUser: AuthUser;

    if(json != null)
      authUser = JSON.parse(json);

    return authUser;
  }

  getUserActions() : string[] {
    let authUser: AuthUser = this.getCurrentUser();
    if(authUser.actions != undefined)
      return authUser.actions;
  }
  
  getCurrentLanguage(): Languages {
    return getLang(localStorage.getItem(this.CURRENT_LANG));
  }

  getUserViews(): string[] {
    let authUser: AuthUser = this.getCurrentUser();
    if(authUser.views != undefined)
      return authUser.views;
  }

  getCurrentToken(): string {
    let token: string = localStorage.getItem(this.TOKEN);
    return token;
  }

  clearAuthData(){
    localStorage.removeItem(this.AUTH_USER);
    localStorage.removeItem(this.TOKEN);
  }
  updateCurrentUser(authUser: LoginModule){
    // debugger
    var user=  this.getCurrentUser();

    if(authUser.views == undefined)
      authUser.views = [];
    else
      user.views=authUser.views;

    if(authUser.action == undefined)
      authUser.action = [];
    else
      user.actions=authUser.action;

    if(authUser.roles == undefined)
      authUser.roles = [];
    else
      user.roles=authUser.roles;

    localStorage.setItem(this.AUTH_USER, JSON.stringify(user));
  }
}
