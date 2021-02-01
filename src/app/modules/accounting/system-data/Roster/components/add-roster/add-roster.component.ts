import { Component, OnInit } from '@angular/core';
import { RosterService } from '../../shared/services/roster.service';
import { FullRoutes } from '../../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AddEditRoster } from '../../shared/data/roster-Addedit.model';
import { AlertInput } from '../../../../../../shared/alerts/alert-input';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SystemParameterDTO } from '../../../../../../modules/accounting/shared/models/system-parameter.model';
import { group } from '@angular/animations';

@Component({
  selector: 'app-add-roster',
  templateUrl: './add-roster.component.html',
  providers:[RosterService]
})
export class AddRosterComponent implements OnInit {
  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.roster'},
    {url:'', label:'sideNav.addRoster'},
  ];
  addEditForm: FormGroup;

  autoCoding: string;
  addEditModel: AddEditRoster;
  alertInput: AlertInput = new AlertInput();
  id: any;
  constructor(private rosterService:RosterService,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
   }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]!=undefined)
      this.findbyId(params["id"]);
      this.id=params["id"];
    });
    this.buildForm();
  
  
    
  }

  clearForm()
  {
    this.addEditForm.reset();
  }
  AddEditRest(){
    
    if(this.addEditForm.valid){
      
      this.ngxService.startBackground();
     
      this.addEditModel = Object.assign({}, this.addEditForm.value);
      
  
        this.rosterService.addEdit(this.addEditModel).subscribe(res=> {
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
      rosterType: [null,[Validators.required]],
      target: [null,[Validators.required,Validators.min(0)]],
      percentage: [null],
      nameRepeate: [null],
      active:[true,[Validators.required]],
      slices: this.formBuilder.array([
       
      ]),
    });
  }
  createslices(): FormGroup {
    return this.formBuilder.group({
      id: [],
      sliceFrom: [null,[Validators.required,Validators.min(0)]],
      sliceTo: [null,[Validators.required,Validators.min(0)]],
      slicePercentge: [null,[Validators.required,Validators.min(0)]],
      total : [null]
    });
  }
  addslices() {
    const slices = this.addEditForm.get('slices') as FormArray;
    slices.push(this.createslices());
/* 
    slices.controls.forEach((item, x) => {
      item['controls']['sliceFrom'].setValidators([Validators.required,Validators.min(0)]);
    /*   const groupKeys = Object.keys(item['controls']);
      groupKeys.forEach((ctrl) => {
        item['controls'][ctrl].setValidators();
      }); 
    }); */
 /*    slices.controls.forEach(element => {
        element['sliceFrom'].setValidators([Validators.required,Validators.min(0)]);
        element['sliceTo'].setValidators([Validators.required,Validators.min(0)]);
        element['slicePercentge'].setValidators([Validators.required,Validators.min(0)]);
      }); */
  }
  deleteslices(index){
    (this.addEditForm.get('slices') as FormArray).removeAt(index);
  }
  updateValidation(type){

   let ff= this.addEditForm.get('rosterType');
   const Group = this.addEditForm.get('slices') as FormArray;
    if(type.target.value=="true")
    {
      Group.controls.forEach((item, x) => {
        Group.removeAt(x);
      });
      this.addEditForm.controls['percentage'].setValidators([Validators.required,Validators.min(0)]);
  let slices= (this.addEditForm.get('slices') as FormArray)
  slices.controls.forEach(element => {
      element.clearValidators();
    });
    }
    else
    {
    
      if(Group.length==0)
      this.addslices();
      this.addEditForm.controls['percentage'].clearValidators();
      let slices= (this.addEditForm.get('slices') as FormArray)
      slices.controls.forEach(element => {
          element['sliceFrom'].setValidators([Validators.required,Validators.min(0)]);
          element['sliceTo'].setValidators([Validators.required,Validators.min(0)]);
          element['slicePercentge'].setValidators([Validators.required,Validators.min(0)]);

        });
    }
  }
  updateTotal(index)
  {
    const slice = this.addEditForm.get('slices') as FormArray;
 let equation=   (parseFloat(slice.at(index).get('sliceTo').value) -parseFloat(slice.at(index).get('sliceFrom').value))/100 ;
    slice.at(index).get('total').setValue(equation*parseFloat(slice.at(index).get('slicePercentge').value));
  }
  addEdit(){
    debugger
 if(this.addEditForm.valid){
  this.ngxService.startBackground();
 
    this.addEditModel = Object.assign({}, this.addEditForm.value);

      this.rosterService.addEdit( this.addEditModel).subscribe(res=> {
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
    if(this.id)
    this.router.navigate(['../../../'+FullRoutes.ROSTER_LIST],{ relativeTo: this.activatedRoute });
 else
    this.router.navigate(['../../'+FullRoutes.ROSTER_LIST],{ relativeTo: this.activatedRoute });
  }
  findbyId(id)
  {
    this.ngxService.start();
    this.rosterService.findById(id)
    .subscribe((res: AddEditRoster) => {
      debugger
      this.addEditModel = res;
      this.addEditModel.slices.forEach((group, i) => {

        const Group = this.addEditForm.get('slices') as FormArray;
        Group.push(this.createslices());});
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

  getSystemCoding() {
    this.rosterService.getSystemParameter('systemCoding')
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
