import { Component, OnInit } from '@angular/core';
import { PriceListService } from '../../shared/services/price-list.service';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { AddEditPriceList } from '../../shared/data/price-list-addedit.model';
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SystemParameterDTO } from '../../../shared/models/system-parameter.model';
import { ExpandSubscriber } from 'rxjs/internal/operators/expand';

@Component({
  selector: 'app-add-price-list',
  templateUrl: './add-price-list.component.html',
  providers:[PriceListService]
})
export class AddPriceListComponent implements OnInit {

  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.priceList'},
    {url:'', label:'sideNav.addPriceList'},
  ];
  addEditForm: FormGroup;
  products: BaseObject[];
  priceFromList: BaseObject[];
  typesList: BaseObject[];
  autoCoding: string;
  addEditModel: AddEditPriceList;
  alertInput: AlertInput = new AlertInput();
  constructor(private priceListService:PriceListService,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
   }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]!=undefined)
      this.findbyId(params["id"]);
    });
    this.buildForm();
  //  this.getProducts();
    this.gePriceFromList();
    this.getTypesList();
  }
  getTypesList() {
    this.priceListService.getLookup('PriceListTypes')
    .subscribe((res: BaseObject[]) => {
      
      this.typesList = res;
      // this.distributors = res;
      // console.log(res)
    }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
    });
  }
  updateValidationType(key:string)
  {
    let dd=this.addEditForm;
    if(key=="Percentage")
    {
      this.addEditForm.get('percentage').setValidators([Validators.required,Validators.min(0)]);
      this.addEditForm.get('percentage').updateValueAndValidity();
      this.addEditForm.get('value').setValidators([]);
      this.addEditForm.get('value').updateValueAndValidity();
      this.addEditForm.get('expenses').setValidators([]);
      this.addEditForm.get('expenses').updateValueAndValidity();
      this.addEditForm.get('profitMargin').setValidators([]);
      this.addEditForm.get('profitMargin').updateValueAndValidity();
    }
    else if(key=="Value") 
    {
      this.addEditForm.get('percentage').setValidators([]);
      this.addEditForm.get('percentage').updateValueAndValidity();
      this.addEditForm.get('value').setValidators([Validators.required,Validators.min(0)]);
      this.addEditForm.get('value').updateValueAndValidity();
     
    }
    else if(key!="Percentage")
    {
      this.addEditForm.get('percentage').setValidators([]);
      this.addEditForm.get('percentage').updateValueAndValidity();
      this.addEditForm.get('value').setValidators([Validators.required,Validators.min(0)]);
      this.addEditForm.get('value').updateValueAndValidity();
      this.addEditForm.get('expenses').setValidators([]);
      this.addEditForm.get('expenses').updateValueAndValidity();
      this.addEditForm.get('profitMargin').setValidators([]);
      this.addEditForm.get('profitMargin').updateValueAndValidity();
    }
  }
  updateDateValidation(type:any)
  {
    if(type=="true"||type==true)
    {
      this.addEditForm.get('dateFrom').setValidators([]);
      this.addEditForm.get('dateFrom').updateValueAndValidity();
      this.addEditForm.get('dateTo').setValidators([]);
      this.addEditForm.get('dateTo').updateValueAndValidity();
    }
    else{
      this.addEditForm.get('dateFrom').setValidators([Validators.required]);
      this.addEditForm.get('dateFrom').updateValueAndValidity();
      this.addEditForm.get('dateTo').setValidators([Validators.required]);
      this.addEditForm.get('dateTo').updateValueAndValidity();
    }
  }
  gePriceFromList() {
    this.priceListService.getLookup('PriceFrom')
    .subscribe((res: BaseObject[]) => {
      this.priceFromList = res;
      // this.distributors = res;
      // console.log(res)
    }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
    });
  }

  clearForm()
  {
    this.addEditForm.reset({active:true});
  }
  AddEditRest(){
    if(this.addEditForm.valid){
      this.ngxService.startBackground();
     
      this.addEditModel = Object.assign({}, this.addEditForm.value);
      
  
        this.priceListService.addEdit(this.addEditModel).subscribe(res=> {
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
      durationType: [null,Validators.required],
      dateFrom:[null],
      dateTo:[null],
      priceFrom:[null,Validators.required],
      value:[null],
      percentage:[null],
      expenses:[null],
      profitMargin:[null],
      pricingType:[null,Validators.required],
      types:[null,Validators.required],
      nameRepeate: [null],
      products: this.formBuilder.array([
        this.createProducts()
      ]),
    });
  }
  createProducts(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      productId: [null, [Validators.required]],
      productUnitId: [null, [Validators.required]],
      units:[null]
    });
  }
  addEdit(){
    
 if(this.addEditForm.valid){
  this.ngxService.startBackground();
 
    this.addEditModel = Object.assign({}, this.addEditForm.value);

       this.priceListService.addEdit( this.addEditModel).subscribe(res=> {
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
    this.router.navigate(['/'+FullRoutes.STOCK_MODULE+'/'+FullRoutes.PRICE_LIST_MODULE+'/'+FullRoutes.PRICE_LIST_LIST]);
  }
  findbyId(id)
  {
    this.ngxService.start();
    this.priceListService.findById(id)
    .subscribe((res: AddEditPriceList) => {
      this.addEditModel = res;
      this.products = res.productlist;
      this.addEditModel.products.forEach((group, i) => {

        const products = this.addEditForm.get('products') as FormArray;
        products.push(this.createProducts());});
      this.addEditForm.patchValue(this.addEditModel);
      
      this.deleteProduct(  this.addEditModel.products.length);
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
  getProducts() {
    this.priceListService.findProductList()
      .subscribe((res: BaseObject[]) => {
        this.products = res;
     
        // this.distributors = res;
        // console.log(res)
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
  }
uniqueval(index)
{
  var current = (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productId'].value;
  var list = (this.addEditForm.get('products') as FormArray).value;
  var isUnique = list.filter(x => x.productId === current).length > 1;
  if (isUnique) {
    (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productId'].setErrors({ notUnique: true });
    (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productId'].setValue(null);
    (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productUnitId'].setValue(null);
    (this.addEditForm.get('products') as FormArray).controls[index].markAsTouched();
   // this.alertifyService.error('systemData.product.uniqueItem');
   
    window.scroll(0,0);
  }
}
  getSystemCoding() {
    this.priceListService.getSystemParameter('systemCoding')
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
  getMeasuringUnits(index) {

    
    var current = (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productId'].value;
    
    this.priceListService.getMeasuringUnitsById(current)
      .subscribe((res: BaseObject[]) => {
        // this.measuringUnits = res;
       (this.addEditForm.get('products') as FormArray).controls[index]['controls']['units'].setValue(res);
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }
  startAutoCompleteProduct(value:String,index:any) {
    debugger
    var current = (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productId'].value;
    /******autoComplete********/
    var current = (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productId'].valueChanges.subscribe(data => {
      this.priceListService.getProductByName(data).subscribe(
        (response: BaseObject[])=>{
               this.products=response;
            
              // (this.addEditForm.get('products') as FormArray).controls[index]['controls']['productlist'].setValue(response);
        },
        error=>{
          console.log(error);
         }
      )
    });

    if(value!=null&&value!=""&&value!=undefined&&value.length!=0){
      
    }
    else{
      console.log("empty string;")
    }
    /******end of autoComplete********/
  
}

addProducts() {
  const products = this.addEditForm.get('products') as FormArray;
  products.push(this.createProducts());
}
deleteProduct(index){
  debugger
  (this.addEditForm.get('products') as FormArray).removeAt(index);
}
getOptionText(option):string {

  if (option != null && (this.products != undefined && this.products != null)) {
    console.log(JSON.stringify(option));
    let name: string = this.products.find(x => x.id == option).name;
    //this.products = [];
    return name;
  }
  
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