import { Subject } from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable()
export class LanguageService{
  lang = new Subject();

}
