import { Component, OnInit } from '@angular/core';
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddBranch } from '../../shared/data/branch-addedit.model';
import { BranchService } from '../../shared/services/branch.service';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SystemParameterDTO } from '../../../shared/models/system-parameter.model';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  providers:[BranchService]
})
export class AddBranchComponent implements OnInit {

  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.branches'},
    {url:'', label:'sideNav.addBranch'},
  ];
  addEditForm: FormGroup;
  autoCoding: string;
  addEditModel: AddBranch;
  alertInput: AlertInput = new AlertInput();
  autoCompleteResults: any[];
  isLoading: boolean;
  id: any;
  constructor(private branchService:BranchService,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
   }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]!=undefined)
      this.findbyId(params["id"]);
      this.id=(params["id"]);
    });
    this.buildForm();
  }
  clearForm()
  {
    this.addEditForm.reset({active:true});
  }
  AddEditRest(){
    if(this.addEditForm.valid){
      this.ngxService.startBackground();
     
      this.addEditModel = Object.assign({}, this.addEditForm.value);
      
  
        this.branchService.addEdit(this.addEditModel).subscribe(res=> {
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
      active:[true,[Validators.required]],
      phone: [null,[Validators.min(0)]],
      address: [null,[Validators.maxLength(100)]],
      nameRepeate: [null]
    });
  }
  addEdit(){
 if(this.addEditForm.valid){
  this.ngxService.startBackground();
 debugger
    this.addEditModel = Object.assign({}, this.addEditForm.value);

      this.branchService.addEdit( this.addEditModel).subscribe(res=> {
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
    this.router.navigate(['../../'+FullRoutes.BRANCH_LIST],{ relativeTo: this.activatedRoute });
    else
    this.router.navigate(['../'+FullRoutes.BRANCH_LIST],{ relativeTo: this.activatedRoute });
  }
  findbyId(id)
  {
    this.ngxService.start();
    this.branchService.findById(id)
    .subscribe((res: AddBranch) => {
      this.addEditModel = res;
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
    this.branchService.getSystemParameter('systemCoding')
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
