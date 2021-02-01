import { Component, OnInit } from '@angular/core';
import { SystemParameterDTO } from '../../../shared/models/system-parameter.model';
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AddEditContactPerson } from '../../shared/data/contact-person-AddEdit.model';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { ContactPersonService } from '../../shared/services/ContactPersonService';


@Component({
  selector: 'app-add-contact-person',
  templateUrl: './add-contact-person.component.html',
  providers:[ContactPersonService]
})
export class AddContactPersonComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.contactperson'},
    {url:'', label:'sideNav.addContactperson'},
  ];
  addEditForm: FormGroup;
  rosters: BaseObject[];
  autoCoding: string;
  addEditModel: AddEditContactPerson;
  alertInput: AlertInput = new AlertInput();
  autoCompleteResults: any[];
  isLoading: boolean;
  constructor(private contactpersonService:ContactPersonService,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
   }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]!=undefined)
      this.findbyId(params["id"]);
    });
    this.buildForm();
  this.findRosters();
  this.startAutoCompleteService();
  }
  getOptionText(option):string {

    if (option != null && (this.autoCompleteResults  != undefined && this.autoCompleteResults  != null)) {
      console.log(JSON.stringify(option));
      let name: string =this.autoCompleteResults.find(x => x.id == option).name;
      //this.products = [];
      return name;
    }
    
  }
  findRosters() {
    this.contactpersonService.findRosterList()
    .subscribe((res: BaseObject[]) => {
      this.rosters = res;
      // this.distributors = res;
      // console.log(res)
    }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
    });
  }

  clearForm()
  {
    this.addEditForm.reset();
  }
  AddEditRest(){
    if(this.addEditForm.valid){
      this.ngxService.startBackground();
     
      this.addEditModel = Object.assign({}, this.addEditForm.value);
      
  
        this.contactpersonService.addEdit(this.addEditModel).subscribe(res=> {
          this.clearForm();
          this.ngxService.stopBackground();
          this.alertInput = new AlertInput("s", "shared.savedsuccess");
        }, error => {
       
          this.ngxService.stopBackground();
          if(error.status==412)
          this.alertInput =new AlertInput('ff', error.error);
          else
          this.alertInput = new AlertInput("f", "error.error500");
        });
        
      }else{
        this.fireValidation(this.addEditForm);
      }
  }
  buildForm(){
    this.addEditForm = this.formBuilder.group({
      id: [null],
      code: [null],
      nameAr: [null,[Validators.required,Validators.maxLength(100)]],
      nameEn: [null,[Validators.maxLength(100)]],
      active:[1,[Validators.required]],
      clientId: [null,Validators.required],
      limitationDays: [null,[Validators.required,Validators.min(0)]],
      creditLimit: [null,[Validators.required,Validators.min(0)]],
      discountPercentage: [null,[Validators.required,Validators.min(0)]],
      subjectCommission: [null,Validators.required],
      rosterId: [null,Validators.required],
      nameRepeate: [null]
    });
  }
  addEdit(){
 if(this.addEditForm.valid){
  this.ngxService.startBackground();
 debugger
    this.addEditModel = Object.assign({}, this.addEditForm.value);

      this.contactpersonService.addEdit( this.addEditModel).subscribe(res=> {
        //this.router.navigate(['/'+FullRoutes.STOCK_MODULE+'/'+FullRoutes.SYSTEM_DATA+'/'+FullRoutes.STOCK_LIST]); 
        this.ngxService.stopBackground();
        this.alertInput = new AlertInput("s", "shared.savedsuccess");
      }, error => {
        this.ngxService.stopBackground();
        if(error.status==412)
        this.alertInput =new AlertInput('ff', error.error);
        else
        this.alertInput = new AlertInput("f", "error.error500");
      });
      
    }else{
      this.fireValidation(this.addEditForm);
    } 
  }
  cancal(){
    this.router.navigate(['/'+FullRoutes.SALES_MODULE+'/'+FullRoutes.CONTACT_PERSON_MODULE+'/'+FullRoutes.CONTACT_PERSON_LIST]);
  }
  findbyId(id)
  {
    this.ngxService.start();
    this.contactpersonService.findById(id)
    .subscribe((res: AddEditContactPerson) => {
      this.addEditModel = res;
      this.autoCompleteResults=res.clients;
      this.addEditForm.patchValue(this.addEditModel);
    
      this.ngxService.stop();
    }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
    });
  }
  fireValidation(formGroup: FormGroup){
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.fireValidation(control);
      }
    });
  }
  startAutoCompleteService() {


    /******autoComplete********/

    this.addEditForm.controls['clientId'].valueChanges
      .subscribe(data => {
        debugger
        this.isLoading = true;
        this.contactpersonService.getCustomers(data).subscribe((res: BaseObject[]) => {
          this.autoCompleteResults = res;
          this.isLoading = false
          // this.distributors = res;
          // console.log(res)
        }, error => {
          this.alertInput = new AlertInput("f", "error.error500");
        });
      }
      );
     
     
    /******end of autoComplete********/
  }

   getSystemCoding() {
    this.contactpersonService.getSystemParameter('systemCoding')
      .subscribe((res: SystemParameterDTO) => {
        this.autoCoding=res.value;
        if(this.autoCoding!="1")
        {
          this.addEditForm.get('code').setValidators([Validators.required,Validators.maxLength(100)]);
          this.addEditForm.get('code').updateValueAndValidity();        }
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
  } 
  numberOnly(e): boolean {
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
}
}
