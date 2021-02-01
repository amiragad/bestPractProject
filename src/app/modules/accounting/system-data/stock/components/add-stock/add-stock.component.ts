import { Component, OnInit } from '@angular/core';
import { FullRoutes } from '../../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseObject } from '../../../../../../modules/accounting/suppliers/shared/data/base-object.model';
import { AddEditStock } from '../../shared/data/addEdit-stock.model';
import { StockService } from '../../shared/services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SystemParameterDTO } from '../../../../../../modules/accounting/shared/models/system-parameter.model';
import { AlertInput } from '../../../../../../shared/alerts/alert-input';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  providers:[StockService]
})
export class AddStockComponent implements OnInit {

  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.stock'},
    {url:'', label:'sideNav.addStock'},
  ];
  addEditForm: FormGroup;
  users: BaseObject[];
  autoCoding: string;
  addEditModel: AddEditStock;
  alertInput: AlertInput = new AlertInput();
  branches: BaseObject[];
  id: any;
  constructor(private stockService:StockService,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
   }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]!=undefined)
      this.findbyId(params["id"]);
      this.id=(params["id"]);
    });
    this.buildForm();
    this.getUsers();
    this.getBranches();
  }


  clearForm()
  {
    //this.addEditForm.markAsPristine;
    this.addEditForm.reset({active:1});
  }
  AddEditRest(){
    if(this.addEditForm.valid){
      this.ngxService.startBackground();
     
      this.addEditModel = Object.assign({}, this.addEditForm.value);
      
  
        this.stockService.addEdit(this.addEditModel).subscribe(res=> {
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
      keeperId: [null,Validators.required],
      phone:[null,[Validators.maxLength(100)]],
      fax:[null,[Validators.maxLength(100)]],
      addressEn:[null,[Validators.maxLength(100)]],
      addressAr:[null,[Validators.maxLength(100)]],
      active:[1,[Validators.required]],
      branchId:[null,[Validators.required]],
      nameRepeate: [null]
    });
  }
  addEdit(){
 if(this.addEditForm.valid){
  this.ngxService.startBackground();
 
    this.addEditModel = Object.assign({}, this.addEditForm.value);

      this.stockService.addEdit( this.addEditModel).subscribe(res=> {
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
    this.router.navigate(['../../../'+FullRoutes.STOCK_LIST],{ relativeTo: this.activatedRoute });
    else
    this.router.navigate(['../../'+FullRoutes.STOCK_LIST],{ relativeTo: this.activatedRoute });
  //  this.router.navigate(['/'+FullRoutes.STOCK_MODULE+'/'+FullRoutes.SYSTEM_DATA+'/'+FullRoutes.STOCK_LIST]);
  }
  findbyId(id)
  {
    this.ngxService.start();
    this.stockService.findById(id)
    .subscribe((res: AddEditStock) => {
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
  getUsers() {
    this.stockService.findUserList()
      .subscribe((res: BaseObject[]) => {
        this.users = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
  }
  getBranches() {
    this.stockService.findBranches()
      .subscribe((res: BaseObject[]) => {
        this.branches = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
  }
  getSystemCoding() {
    this.stockService.getSystemParameter('systemCoding')
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
