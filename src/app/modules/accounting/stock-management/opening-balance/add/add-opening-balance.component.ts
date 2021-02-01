import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { openingBalanceService } from '../shared/services/opening-balance.service';
import { ProductService } from '../../../system-data/products/shared/services/product.service';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { InputPermissionService } from '../../permissions/inPutPermission/shared/services/input-permission.service';

@Component({
  selector: 'app-add-opening-balance',
  templateUrl: './add-opening-balance.component.html',
  styleUrls: ['./add-opening-balance.component.scss'],
  providers: [openingBalanceService,InputPermissionService]
})
export class AddOpeningBalanceComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'sideNav.stock' },
    { url: '', label: 'stockManagement.stockBalance.openingBalance' }
  ];
  alertInput: AlertInput = new AlertInput();
  saveSucceeded: boolean = false;
  hasTax: boolean = false;
  fileName: string;
  imageSrc: string = '';
  autoCoding: string;
  addEditForm: FormGroup;
  addEditModel: any;
  attchement: File;
  measuringUnits: BaseObject[];
  products: BaseObject[];
  productTypeKey: string;
  inventory: BaseObject[];
  firstProducts: BaseObject[]= [];
  ProductTypes: any;
  /******autoComplete********/
  autoCompleteResults: any;
  isLoading = false;
  errorMsg = null;
  /******end of autoComplete********/
  @ViewChild('searchByname') searchNameElement: ElementRef;
  @ViewChild('searchByCode') searchCodeElement: ElementRef;

  constructor(private openingBalanceService: openingBalanceService,
    private permissionService:InputPermissionService ,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private alertifyService: AlertifyService,
    private router: Router,
    protected translate: TranslateService,
    private ngxService: NgxUiLoaderService,
    private http: HttpClient) {
    this.getSystemCoding();
  }

  ngOnInit() {
    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] != undefined)
        this.findbyId(params["id"]);
      else {
        this.addInventoryProducts();
      }
    });
    this.getStoks();
    // this.getMeasuringUnits();
    // this.getProducts();
  }


  clearForm() {
    this.addEditForm.reset();
  }
  AddEditRest() {
    if (this.addEditForm.valid) {
      this.ngxService.startBackground();
      this.openingBalanceService.addEdit(this.addEditForm.value).subscribe(res => {
        this.clearForm();
        this.ngxService.stopBackground();
      }, error => {
        console.log(error);
        this.ngxService.stopBackground();
      });

    } else {
      this.fireValidation(this.addEditForm);
    }
  }
  addEdit() {
    if (this.addEditForm.valid) {
      this.ngxService.startBackground();
      this.openingBalanceService.addEdit(this.addEditForm.value).subscribe(res => {
        this.router.navigate(['/' + FullRoutes.STOCK_MODULE + '/' + FullRoutes.OPENING_BALANCE + '/' + FullRoutes.OPENING_BALANCE_LIST]);
        this.ngxService.stopBackground();
        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        this.ngxService.stopBackground();
        //this.alertify.error(error);
      });

    } else {
      this.fireValidation(this.addEditForm);
    }
  }
  //InventoryProducts
  addInventoryProducts() {
    const InventoryProducts = this.addEditForm.get('inventoryProducts') as FormArray;
    InventoryProducts.push(this.createInventoryProducts());
  }
  deleteInventoryProducts(index) {
    var current = (this.addEditForm.get('inventoryProducts') as FormArray).at(index).value;
    if (current.id > 0) {
      this.openingBalanceService.deletProductUnitById(current.id).subscribe(res => {
        //TODO: Use Success Alert
        this.translate.get('shared.deletedSuccess').subscribe(res => {
          this.alertifyService.success(res);
        });
        (this.addEditForm.get('inventoryProducts') as FormArray).removeAt(index);
      }, error => {
        //TODO: Use Failure Alert
      });
    } else {
      (this.addEditForm.get('inventoryProducts') as FormArray).removeAt(index);
    }
  }

  onInventoryProductsChange(index) {
    // if ((this.addEditForm.get('inventoryProducts') as FormArray).value.length < 2) {
    //   return;
    // }
    // else {
    //   var current = (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['measruingUnitId'].value;
    //   var list = (this.addEditForm.get('inventoryProducts') as FormArray).value;
    //   var isUnique = list.filter(x => x.measruingUnitId === current).length > 1;
    //   if (isUnique) {
    //     (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['measruingUnitId'].setErrors({ notUnique: true });
    //     (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['measruingUnitId'].setValue(null);
    //     (this.addEditForm.get('inventoryProducts') as FormArray).controls[index].markAsTouched();
    //     this.translate.get('systemData.product.uniqueItem').subscribe(res => {
    //       this.alertifyService.error(res);
    //     });
    //   }
    // }
  }

  productTypeChange() {
    let selectetype = this.addEditForm.get('productTypeId').value;
    this.productTypeKey = this.ProductTypes.filter(x => x.id == selectetype)[0].key;
  }

  buildForm() {
    this.addEditForm = this.formBuilder.group({
      id: [null],
      code: [null],
      descriptionEn: [null, [Validators.maxLength(500)]],
      descriptionAr: [null, [Validators.maxLength(500)]],
      inventoryId: [null, Validators.required],
      date: [new Date(), Validators.required],
      inventoryProducts: this.formBuilder.array([]),
    });
  }

  
  createInventoryProducts(): FormGroup {
    return this.formBuilder.group({
      id: [],
      units: [],
      quantity: [1, [Validators.required, Validators.min(1)]],
      purchasingPrice: [1, [Validators.required, Validators.min(1)]],
      total: [1, [Validators.required, Validators.min(1)]],
      productId: [null, [Validators.required]],
      productCode: [null, [Validators.required]],

      UnitId: [null, [Validators.required]]
    });
  }

  totalChange(inventoryProductsIndex) {
    (this.addEditForm.get('inventoryProducts') as FormArray).controls[inventoryProductsIndex]['controls']['total'].setValue(
      (this.addEditForm.get('inventoryProducts') as FormArray).controls[inventoryProductsIndex]['controls']['quantity'].value *
      (this.addEditForm.get('inventoryProducts') as FormArray).controls[inventoryProductsIndex]['controls']['purchasingPrice'].value
    );
  }

  // onInventoryProducts(index) {
  //   if ((this.addEditForm.get('inventoryProducts') as FormArray).value.length < 2) {
  //     return;
  //   }
  //   else {
  //     var current = (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].value;
  //     var list = (this.addEditForm.get('inventoryProducts') as FormArray).value;
  //     var isUnique = list.filter(x => x.productId === current).length > 1;
  //     if (isUnique) {
  //       (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setErrors({ notUnique: true });
  //       (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setValue(null);
  //       (this.addEditForm.get('inventoryProducts') as FormArray).controls[index].markAsTouched();
  //       this.alertifyService.error('systemData.product.uniqueItem');
  //     }
  //   }
  // }


  uploadImage(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    debugger;
    let reader = e.target;
    this.imageSrc = reader.result;
    let base64 = this.imageSrc.split(';base64,')[1];
    let fileExtention = this.imageSrc.split(';base64,')[0].split('data:image/')[1];
    this.addEditForm.get('fileExtention').setValue(fileExtention);
    this.addEditForm.get('file').setValue(base64);
  }

  removeAttachment() {
    this.addEditForm.get('file').patchValue("");
    this.attchement = null;
    this.fileName = null;
    this.imageSrc = null;
    // this.attchement =; //null;
  }

  cancal() {
    this.router.navigate(['/' + FullRoutes.STOCK_MODULE + '/' + FullRoutes.OPENING_BALANCE + '/' + FullRoutes.OPENING_BALANCE_LIST]);
  }
  findbyId(id) {
    this.ngxService.start();
    this.openingBalanceService.findById(id)
      .subscribe((res: any) => {
        this.addEditModel = res;
        this.addEditModel.inventoryProducts.forEach((unit, x) => {
          const units = this.addEditForm.get('inventoryProducts') as FormArray;
          units.push(this.createInventoryProducts());
        });
        this.addEditForm.patchValue(this.addEditModel);
        this.addEditModel.inventoryProducts.forEach((unit, x) => {
          this.getMeasuringUnits(x);
        });
        this.ngxService.stop();
      }, error => {
        console.log(error);
        this.ngxService.stop();
        //this.alertify.error(error);
      });
  }
  fireValidation(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.fireValidation(control);
      }
    });
  }

  //   lookups                                                                  

  // getMeasuringUnits() {
  //   this.openingBalanceService.getMeasuringUnits()
  //     .subscribe((res: BaseObject[]) => {
  //       this.measuringUnits = res;
  //       // console.log(res)
  //     }, error => {
  //       console.log(error);
  //       //this.alertify.error(error);
  //     });
  // }

  getMeasuringUnits(index) {
    var current = (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].value;
    this.openingBalanceService.getMeasuringUnitsById(current)
      .subscribe((res: BaseObject[]) => {
        // this.measuringUnits = res;
        (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['units'].setValue(res);
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }
  getSystemCoding() {
    this.openingBalanceService.getSystemParameter('systemCoding')
      .subscribe((res: any) => {
        this.autoCoding = res.value;
        if (this.autoCoding != "1") {
          this.addEditForm.setValidators([Validators.required, Validators.maxLength(100)]);
        }
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }

  getProducts() {
    this.openingBalanceService.getProducts()
      .subscribe((res: BaseObject[]) => {
        this.products = res;
        // console.log(res)
      }, error => {
        console.log(error);
      });
  }

  getStoks() {
    this.openingBalanceService.getStoks()
      .subscribe((res: BaseObject[]) => {
        this.inventory = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }

  startAutoCompleteService() {
    /******autoComplete********/
    this.addEditForm.get("productId").valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.autoCompleteResults = [];
          this.isLoading = true;
        }),
        switchMap(value => this.http.get("http://localhost:63181/api/Product/start?id=" + value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        if (data['l'] == undefined || data['l'].length == 0) {
          this.autoCompleteResults = [];
          this.errorMsg = "This value doesn't exist";
          console.log(this.errorMsg)
        } else {
          this.autoCompleteResults = data['l'];
          this.errorMsg = null;
        }
      });
    /******end of autoComplete********/
  }
  setCodeControlValue(index){
    var current = (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].value;
    let product=this.firstProducts.find(x=>x.id==current);
    (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productCode'].setValue(product.code);

   }
   onInventoryProducts(index) {
    if ((this.addEditForm.get('inventoryProducts') as FormArray).value.length < 2) {
      this.setCodeControlValue(index);
      return;
    }
    else {
      var current = (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].value;
      var list = (this.addEditForm.get('inventoryProducts') as FormArray).value;
      var isUnique = list.filter(x => x.productId === current).length > 1;

      if (isUnique) {
        (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setErrors({ notUnique: true });
        (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setValue(null);
        (this.addEditForm.get('inventoryProducts') as FormArray).controls[index].markAsTouched();
       // this.alertifyService.error('systemData.product.uniqueItem');
        this.alertInput = new AlertInput("f", "permissions.repated");
        return;
      }
      else{
        this.setCodeControlValue(index);

      }
    }
    
  }
  getOptionText(option): string {
    if (option != null && (this.firstProducts != undefined && this.firstProducts != null)) {
      console.log(JSON.stringify(option));
      let name: string = this.firstProducts.find(x => x.id == option).name;
      //this.firstProducts=[];
      return name;
    }
  }
  selectProductByCode(index) {

    console.log(JSON.stringify(index));
    var current = (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productCode'].value;
    let product = this.firstProducts.find(x => x.code == current);

    //let id:number= this.SeconedProducts.find(x=>x.code==option).id;
    (this.addEditForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setValue(product.id);
    this.onInventoryProducts(index);
    this.getMeasuringUnits(index);
  }
  startAutoCompleteProduct(value: String, searchIn: String) {
    let val: string = "";
    val = searchIn == 'name' ? this.searchNameElement.nativeElement.value
      : this.searchCodeElement.nativeElement.value;
    console.log("val:- " + val + " : " + searchIn);

    console.log("auto complete triggered with value:- " + value + " : " + searchIn);
    /******autoComplete********/

    if (val != null && val != "" && val != undefined && val.length != 0) {
      this.isLoading = true;
      if (searchIn == 'name') {

        this.permissionService.getProductByName(val).subscribe(
          (response: BaseObject[]) => {
            this.firstProducts = response;
            this.isLoading = false;

            console.log("serach objs :- :- :- " + JSON.stringify(this.firstProducts));

          },
          error => {
            this.isLoading = false;

            console.log(error);
          }
        )
      }
      if (searchIn == 'code') {

        this.permissionService.getProductByKey(val).subscribe(
          (response: BaseObject[]) => {
            this.isLoading = false;

            this.firstProducts = response;
            console.log("serach objs :- :- :- " + JSON.stringify(this.firstProducts));
          },
          error => {
            this.isLoading = false;

            console.log(error);
          }
        )
      }
    }
    else {
      console.log("empty string;")
    }
    /******end of autoComplete********/

  }

}
