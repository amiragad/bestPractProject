import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import * as $ from "jquery";
import { ProductService } from '../shared/services/product.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SystemParameterDTO } from '../../../shared/models/system-parameter.model';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize, switchMap, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { FormValidators } from '../../../../../infrastructure/common/form-validators';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [ProductService]
})
export class AddProductComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'sideNav.products.products' },
    { url: '', label: 'sideNav.products.productAdd' }
  ];
  saveSucceeded: boolean = false;
  hasTax: boolean = true;
  fileName: string;
  imageSrc: string = '/assets/images/icons/thumbnail.jpg';
  autoCoding: string;
  addEditForm: FormGroup;
  addEditModel: any;
  attchement: File;
  countries: BaseObject[];
  ProductTypes: BaseObject[];
  productGroups: BaseObject[];
  colors: BaseObject[];
  sizes: BaseObject[];
  costCalculations: BaseObject[];
  storagePlaces: BaseObject[];
  collectAndManufactur: BaseObject[];
  ProductCategories: BaseObject[];
  measuringUnits: BaseObject[];
  products: any[];
  productTypeKey: string;
  alertInput: AlertInput = new AlertInput();
  isProductLoading: boolean;
  allProduct: BaseObject[];
  isEditedProduct: boolean;
  productList: any;
  edtiMode: boolean = false;
  measurmentUnits: BaseObject[];

  constructor(private http: HttpClient,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private alertifyService: AlertifyService,
    private router: Router,
    protected translate: TranslateService,
    private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
  }

  ngOnInit() {
    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] != undefined) {
        this.findbyId(params["id"]);
        this.edtiMode = true;
        this.getMeasuringUnits();
      }
      else {
        this.addProductUnits();
        this.getMeasuringUnits();
      }
    });
    this.getCountries();
    this.getProductTypes();
    this.getProductGroups();
    this.getColors();
    this.getSizes();
    this.geCostCalculations();
    this.getStoragePlaces();
    this.getCollectAndManufactur();
    this.getProductCategories();

    this.addEditForm.get('hasTax').valueChanges.subscribe(value => {
      this.hasTax = JSON.parse(value);
      if (this.hasTax) {
        this.addEditForm.get('taxAmount').setValue(5);
        this.addEditForm.get('taxAmount').setValidators([Validators.required, Validators.min(0)]);
        this.addEditForm.updateValueAndValidity();
      } else {
        this.addEditForm.get('taxAmount').setValue(0);
        this.addEditForm.get('taxAmount').clearValidators();
      }
    });
    this.getProducts();
    // this.startAutoCompleteService();
  }

  // startAutoCompleteService() {
  //   /******autoComplete********/
  //   this.autoCompleteCtrl.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       tap(() => {
  //         this.autoCompleteResults = [];
  //         this.isLoading = true;
  //       }),
  //       switchMap(value => this.http.get("http://localhost:8200/start?id=" + value)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe(data => {
  //       if (data['l'] == undefined || data['l'].length == 0) {
  //         this.autoCompleteResults = [];
  //         this.errorMsg = "This value doesn't exist";
  //         console.log(this.errorMsg)
  //       } else {
  //         this.autoCompleteResults = data['l'];
  //         this.errorMsg = null;
  //       }
  //     });
  //   /******end of autoComplete********/
  // }
  clearForm() {
    this.buildForm();
    this.getProducts();
    this.addProductUnits();
    if (this.ProductTypes.length > 0)
      this.addEditForm.get('productTypeId').setValue(this.ProductTypes.filter(x => x.key == "store")[0].id);
    this.addEditForm.get('productCategoryId').setValue(this.ProductCategories[0].id);
    (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['measruingUnitId']
      .setValue(this.measurmentUnits.filter(x => x.key == "item")[0].id.toString());
    (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['conversionFactor']
      .setValue(1);
    this.hasTax = true;
    this.addEditForm.get('hasTax').valueChanges.subscribe(value => {
      this.hasTax = JSON.parse(value);
      if (this.hasTax) {
        this.addEditForm.get('taxAmount').setValue(5);
        this.addEditForm.get('taxAmount').setValidators([Validators.required, Validators.min(0)]);
        this.addEditForm.updateValueAndValidity();
      } else {
        this.addEditForm.get('taxAmount').setValue(0);
        this.addEditForm.get('taxAmount').clearValidators();
      }
    });

  }
  AddEditRest() {
    let selectetype = this.addEditForm.get('nameRepeate').value;
    if (selectetype == true)
      this.addEditForm.get('nameEn').setValue(this.addEditForm.get('nameAr').value);
    (<any>Object).values((this.addEditForm.get('aggregateProd') as FormGroup).controls).forEach(control => {
      control.setValidators(null);
      control.updateValueAndValidity();
    });
    if (this.productTypeKey == 'collection' && (!this.productList || this.productList.length < 1)) {
      this.alertifyService.error('purchasing.rebate.productReq');
      return;
    }
    if (this.addEditForm.valid) {
      var model = this.addEditForm.value;
      if (this.productList && this.productList.length > 0) {
        var pList = this.productList;
        pList.forEach((product, x) => {
          product.product = null;
          product.unit = null;
        });
        model.aggregateProduct = pList;
      } else {
        model.aggregateProduct = [];
      }
      this.ngxService.startBackground();
      this.productService.addEdit(model).subscribe(res => {
        this.clearForm();
        this.ngxService.stopBackground();
        this.alertInput = new AlertInput("s", "shared.savedsuccess");

      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        this.ngxService.stopBackground();
      });

    } else {
      this.fireValidation(this.addEditForm);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["measruingUnitId"].setValidators([Validators.required]);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["productItemId"].setValidators([Validators.required]);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["quantity"].setValidators([Validators.required, Validators.min(0)]);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["measruingUnitId"].updateValueAndValidity();
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["productItemId"].updateValueAndValidity();
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["quantity"].updateValueAndValidity();

    }
  }
  addEdit() {
    let selectetype = this.addEditForm.get('nameRepeate').value;
    if (selectetype == true)
      this.addEditForm.get('nameEn').setValue(this.addEditForm.get('nameAr').value);
    (<any>Object).values((this.addEditForm.get('aggregateProd') as FormGroup).controls).forEach(control => {
      control.setValidators(null);
      control.updateValueAndValidity();
    });
    if (this.productTypeKey == 'collection' && (!this.productList || this.productList.length < 1)) {
      this.alertifyService.error('purchasing.rebate.productReq');
      return;
    }
    if (this.addEditForm.valid) {
      var model = this.addEditForm.value;
      if (this.productList && this.productList.length > 0) {
        var pList = this.productList;
        pList.forEach((product, x) => {
          product.product = null;
          product.unit = null;
        });
        model.aggregateProduct = pList;
      } else {
        model.aggregateProduct = [];
      }
      this.ngxService.startBackground();
      this.productService.addEdit(model).subscribe(res => {
        //  this.router.navigate(['/' + FullRoutes.STOCK_MODULE + '/' + FullRoutes.SYSTEM_DATA + '/' + FullRoutes.PRODUCT]);
        this.ngxService.stopBackground();
        this.alertInput = new AlertInput("s", "shared.savedsuccess");
        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        this.ngxService.stopBackground();
        //this.alertify.error(error);
      });

    } else {
      this.fireValidation(this.addEditForm);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["measruingUnitId"].setValidators([Validators.required]);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["productItemId"].setValidators([Validators.required]);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["quantity"].setValidators([Validators.required, Validators.min(0)]);
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["measruingUnitId"].updateValueAndValidity();
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["productItemId"].updateValueAndValidity();
      (this.addEditForm.get('aggregateProd') as FormGroup).controls["quantity"].updateValueAndValidity();

    }
  }
  //productUnit
  addProductUnits() {
    if (this.addEditForm.get('productUnits').valid) {
      const productUnits = this.addEditForm.get('productUnits') as FormArray;
      productUnits.push(this.createProductUnits());
      this.SelectTrueOne();
      this.SelectTrueOneReport();
      this.SelectTrueOneAddition();
      this.SelectTrueOneCashing();
    } else {
      (<any>Object).values((this.addEditForm.get('productUnits') as FormArray).controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
          this.fireValidation(control);
        }
      });
    }
  }
  deleteProductUnits(index) {
    var current = (this.addEditForm.get('productUnits') as FormArray).at(index).value;
    if (current.id > 0) {
      this.productService.deletProductUnitById(current.id).subscribe(res => {
        //TODO: Use Success Alert
        //this.translate.get('shared.deletedSuccess').subscribe(res => {
        this.alertifyService.success('shared.deletedSuccess');
        // });

        (this.addEditForm.get('productUnits') as FormArray).removeAt(index);
        this.SelectTrueOne();
        this.SelectTrueOneReport();
        this.SelectTrueOneAddition();
        this.SelectTrueOneCashing();
      }, error => {
        //TODO: Use Failure Alert
        this.alertInput = new AlertInput("f", "error.error500");
      });
    } else {
      (this.addEditForm.get('productUnits') as FormArray).removeAt(index);
      this.SelectTrueOne();
      this.SelectTrueOneReport();
      this.SelectTrueOneAddition();
      this.SelectTrueOneCashing();
    }
  }

  onAggregateProduct(index) {
    if ((this.addEditForm.get('aggregateProduct') as FormArray).value.length < 2) {
      return;
    }
    else {
      var current = (this.addEditForm.get('aggregateProduct') as FormArray).controls[index]['controls']['productItemId'].value;
      var list = (this.addEditForm.get('aggregateProduct') as FormArray).value;
      var isUnique = list.filter(x => x.productItemId === current).length > 1;
      if (isUnique) {
        (this.addEditForm.get('aggregateProduct') as FormArray).controls[index]['controls']['productItemId'].setErrors({ notUnique: true });
        (this.addEditForm.get('aggregateProduct') as FormArray).controls[index]['controls']['productItemId'].setValue(null);
        (this.addEditForm.get('aggregateProduct') as FormArray).controls[index].markAsTouched();
        //  this.translate.get('systemData.product.uniqueItem').subscribe(res => {
        this.alertifyService.error('systemData.product.uniqueItem');
        //  }); */
        //  this.alertInput = new AlertInput("f", "systemData.product.uniqueItem");
      }
    }
  }
  onProductUnitsChange(index) {
    if ((this.addEditForm.get('productUnits') as FormArray).value.length < 2) {
      return;
    }
    else {
      var current = (this.addEditForm.get('productUnits') as FormArray).controls[index]['controls']['measruingUnitId'].value;
      var list = (this.addEditForm.get('productUnits') as FormArray).value;
      var isUnique = list.filter(x => x.measruingUnitId === current).length > 1;
      if (isUnique) {
        (this.addEditForm.get('productUnits') as FormArray).controls[index]['controls']['measruingUnitId'].setErrors({ notUnique: true });
        (this.addEditForm.get('productUnits') as FormArray).controls[index]['controls']['measruingUnitId'].setValue(null);
        (this.addEditForm.get('productUnits') as FormArray).controls[index].markAsTouched();
        //  this.translate.get('systemData.product.uniqueItem').subscribe(res => {
        this.alertifyService.error('systemData.product.uniqueItem');
        //}); */
        //  this.alertInput = new AlertInput("f", "systemData.product.uniqueItem");

      }
    }
  }
  onConversionFactorChange(index) {
    if ((this.addEditForm.get('productUnits') as FormArray).value.length < 2) {
      return;
    }
    else {
      var current = (this.addEditForm.get('productUnits') as FormArray).controls[index]['controls']['conversionFactor'].value;
      var list = (this.addEditForm.get('productUnits') as FormArray).value;
      var isUnique = list.filter(x => x.conversionFactor === current).length > 1;
      if (isUnique) {
        (this.addEditForm.get('productUnits') as FormArray).controls[index]['controls']['conversionFactor'].setErrors({ notUnique: true });
        (this.addEditForm.get('productUnits') as FormArray).controls[index]['controls']['conversionFactor'].setValue(null);
        (this.addEditForm.get('productUnits') as FormArray).controls[index].markAsTouched();
        this.alertifyService.error('systemData.product.uniqueConversionFactor');
      }
    }
  }

  productTypeChange() {
    let selectetype = this.addEditForm.get('productTypeId').value;
    if (this.ProductTypes && this.ProductTypes.length > 0) {
      this.productTypeKey = this.ProductTypes.filter(x => x.id == selectetype)[0].key;
      if (this.productTypeKey == "note") {
        while ((this.addEditForm.get('productUnits') as FormArray).length !== 0) {
          (this.addEditForm.get('productUnits') as FormArray).removeAt(0)
        }
      } else {
        if ((this.addEditForm.get('productUnits') as FormArray).length < 1) {
          this.addProductUnits();
          if (this.measurmentUnits.length > 0)
            (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['measruingUnitId']
              .setValue(this.measurmentUnits.filter(x => x.key == "item")[0].id.toString());
          (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['conversionFactor']
            .setValue(1);
        }
      }

    }
  }
  SelectOnlyOneCashing(Index) {
    var list = (this.addEditForm.get('productUnits') as FormArray).controls;
    list.forEach((control, i) => {
      if (i === Index) {
        control['controls']['cashing'].setValue(true);
      } else {
        control['controls']['cashing'].setValue(false);
      }
    });
  }
  SelectOnlyOneAddition(Index) {
    var list = (this.addEditForm.get('productUnits') as FormArray).controls;
    list.forEach((control, i) => {
      if (i === Index) {
        control['controls']['addition'].setValue(true);
      } else {
        control['controls']['addition'].setValue(false);
      }
    });
  }
  SelectOnlyOneReports(Index) {
    var list = (this.addEditForm.get('productUnits') as FormArray).controls;
    list.forEach((control, i) => {
      if (i === Index) {
        control['controls']['report'].setValue(true);
      } else {
        control['controls']['report'].setValue(false);
      }
    });
  }
  SelectTrueOneReport() {
    var list = (this.addEditForm.get('productUnits') as FormArray).value;
    var isNotUnique = list.filter(x => x.report == true).length > 0;
    if (isNotUnique) {
      return true;
    } else {
      (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['report'].setValue(true);
    }
  }
  SelectTrueOneAddition() {
    var list = (this.addEditForm.get('productUnits') as FormArray).value;
    var isNotUnique = list.filter(x => x.addition == true).length > 0;
    if (isNotUnique) {
      return true;
    } else {
      (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['addition'].setValue(true);
    }
  }
  SelectTrueOneCashing() {
    var list = (this.addEditForm.get('productUnits') as FormArray).value;
    var isNotUnique = list.filter(x => x.cashing == true).length > 0;
    if (isNotUnique) {
      return true;
    } else {
      (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['cashing'].setValue(true);
    }
  }
  SelectTrueOne() {
    var list = (this.addEditForm.get('productUnits') as FormArray).value;
    var isNotUnique = list.filter(x => x.default == true).length > 0;
    if (isNotUnique) {
      return true;
    } else {
      (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['default'].setValue(true);
    }
  }


  buildForm() {
    this.addEditForm = this.formBuilder.group({
      id: [null],
      code: [null],
      barCode: [null, [Validators.maxLength(100)]],
      nameAr: [null, [Validators.required, Validators.maxLength(200), FormValidators.emptyStr]],
      nameEn: [" ", [Validators.maxLength(200)]],
      description: [null, [Validators.maxLength(200)]],
      productTypeId: [null, Validators.required],
      productGroupId: [null],
      model: [null],
      countryId: [null],
      hasTax: [true, Validators.required],
      taxAmount: [5],// [Validators.required, Validators.min(0),FormValidatorsvalidNumber]
      colorId: [null],
      sizeId: [null],
      collectAndManufacturId: [null],
      productCategoryId: [null, Validators.required],
      costCalculationId: [null, Validators.required],
      storagePlaceId: [null],
      active: [true, Validators.required],
      limitOfDemand: [null, [Validators.min(0)]],
      nameRepeate: [true],
      fileExtention: [null],
      file: [null],
      aggregateProd: this.formBuilder.group({
        id: [],
        measruingUnitId: [null, [Validators.required]],
        quantity: [null, [Validators.required, Validators.min(0)]],
        productItemId: [null, [Validators.required]],
      }),
      productUnits: this.formBuilder.array([]),
      aggregateProduct: []//this.formBuilder.array([])
    });
  }
  createProductUnits(): FormGroup {
    return this.formBuilder.group({
      id: [],
      barCode: ['', [Validators.maxLength(25)]],
      default: [false, [Validators.required]],
      addition: [false],
      cashing: [false],
      report: [false],
      purchasingPrice: [null, [Validators.required, Validators.min(0)]],
      sellingPrice: [null, [Validators.required, Validators.min(0)]],
      conversionFactor: [null, [Validators.required, Validators.min(1)]],
      measruingUnitId: [null, [Validators.required]],
    });
  }
  // createAggregateProduct(): FormGroup {
  //   return this.formBuilder.group({
  //     id: [],
  //     measruingUnitId: [null, [Validators.required]],
  //     quantity: [null, [Validators.required, Validators.min(0)]],
  //     productItemId: [null, [Validators.required]],
  //   });
  // }

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

  uploadImage(e) {

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.fileName = file.name;
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
    let reader = e.target;
    this.imageSrc = reader.result;
    let base64 = this.imageSrc.split(';base64,')[1];
    let fileExtention = this.imageSrc.split(';base64,')[0].split('data:image/')[1];
    this.addEditForm.get('fileExtention').setValue(fileExtention);
    this.addEditForm.get('file').patchValue(base64);
    this.addEditForm.controls["file"].patchValue(base64);
  }


  removeAttachment() {
    this.addEditForm.get('file').patchValue("");
    this.attchement = null;
    this.fileName = null;
    this.imageSrc = '/assets/images/icons/thumbnail.jpg';
    // this.attchement =; //null;
  }

  cancal() {
    this.router.navigate(['/' + FullRoutes.STOCK_MODULE + '/' + FullRoutes.SYSTEM_DATA + '/' + FullRoutes.PRODUCT]);
  }
  findbyId(id) {
    this.ngxService.start();
    this.productService.findById(id)
      .subscribe((res: any) => {
        this.addEditModel = res;
        this.imageSrc = res.productImage;
        this.fileName = res.imageName;
        this.addEditModel.productUnits.forEach((unit, x) => {
          const units = this.addEditForm.get('productUnits') as FormArray;
          units.push(this.createProductUnits());
        });
        this.productList = this.addEditModel.aggregateProduct;
        // this.addEditModel.aggregateProduct.forEach((quest, x) => {
        //   const aggregateProduct = this.addEditForm.get('aggregateProduct') as FormArray;
        //   aggregateProduct.push(this.createAggregateProduct());
        // });

        this.addEditForm.patchValue(this.addEditModel);
        if (this.addEditModel.productUnits.length > 0) {
          this.SelectTrueOne();
          this.SelectTrueOneReport();
          this.SelectTrueOneAddition();
          this.SelectTrueOneCashing();
        }
        this.ngxService.stop();
        this.productTypeChange();
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
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
  getProductTypes() {
    this.productService.getLookup('productType')
      .subscribe((res: BaseObject[]) => {
        this.ProductTypes = res;
        if (this.ProductTypes.length > 0)
          this.addEditForm.get('productTypeId').setValue(this.ProductTypes.filter(x => x.key == "store")[0].id);
        // console.log(res)
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  getProductCategories() {
    this.productService.getProductCategories()
      .subscribe((res: BaseObject[]) => {
        this.ProductCategories = res;
        this.addEditForm.get('productCategoryId').setValue(this.ProductCategories[0].id);
        // console.log(res)
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  getCountries() {
    this.productService.getLookup('country')
      .subscribe((res: BaseObject[]) => {
        this.countries = res;
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  getProductGroups() {
    this.productService.getLookup('productGroup')
      .subscribe((res: BaseObject[]) => {
        this.productGroups = res;
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  getColors() {
    this.productService.getLookup('color')
      .subscribe((res: BaseObject[]) => {
        this.colors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  getSizes() {
    this.productService.getLookup('size')
      .subscribe((res: BaseObject[]) => {
        this.sizes = res;
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  geCostCalculations() {
    this.productService.getLookup('costCalculation')
      .subscribe((res: BaseObject[]) => {
        this.costCalculations = res;
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  getStoragePlaces() {
    this.productService.getLookup('storagePlace')
      .subscribe((res: BaseObject[]) => {
        this.storagePlaces = res;
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }
  getCollectAndManufactur() {
    this.productService.getLookup('collectAndManufactur')
      .subscribe((res: BaseObject[]) => {
        this.collectAndManufactur = res;
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }
  getMeasuringUnits() {
    this.productService.getLookup('measruingUnit')
      .subscribe((res: BaseObject[]) => {
        this.measurmentUnits = res;
        if (this.measurmentUnits.length > 0 && !this.edtiMode)
          (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['measruingUnitId']
            .setValue(this.measurmentUnits.filter(x => x.key == "item")[0].id.toString());
        (this.addEditForm.get('productUnits') as FormArray).controls[0]['controls']['conversionFactor']
          .setValue(1);
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }
  getSystemCoding() {
    this.productService.getSystemParameter('systemCoding')
      .subscribe((res: any) => {
        this.autoCoding = res.value;
        if (this.autoCoding != "1") {
          this.addEditForm.get('code').setValidators([Validators.required, Validators.maxLength(100)]);
          this.addEditForm.get('code').updateValueAndValidity();
        }
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  }

  //aggregate product
  getProducts() {
    /******autoComplete********/
    (this.addEditForm.get('aggregateProd') as FormGroup).controls['productItemId'].valueChanges
      .subscribe(data => {
        // debugger
        this.isProductLoading = true;
        this.productService.getProduct(data).subscribe((res: any[]) => {
          this.products = res;
          this.isProductLoading = false;
        }, error => {
          this.alertInput = new AlertInput("f", "error.error500");
        });
      });
    /******end of autoComplete********/
  }

  getOptionProductText(option): string {
    if (option != null && (this.products != undefined && this.products != null)) {
      console.log(JSON.stringify(option));
      var product = this.products.find(x => x.id == option);
      this.allProduct = this.products;
      let name: string = product.name;
      this.measuringUnits = [];
      this.measuringUnits = product.productUnits;
      return name;
    }
  }

  restProduct() {
    this.addEditForm.get('aggregateProd').reset();
    this.isEditedProduct = false;
  }

  saveProducts() {
    if (this.addEditForm.get('aggregateProd').valid) {
      if (this.allProduct != undefined && this.allProduct != null) {
        var purchaseProduct = this.addEditForm.get('aggregateProd').value;
        var product = this.allProduct.filter(x => x.id == purchaseProduct.productItemId)[0];
        var unit = this.measuringUnits.filter(x => x.id == purchaseProduct.measruingUnitId)[0];
        if (!this.productList)
          this.productList = [];
        if (this.productList.filter(x => x.productItemId == product.id && x.unitId == unit.id).length < 1) {
          this.productList.push({
            id: purchaseProduct.id,
            measruingUnitId: unit.id,
            quantity: purchaseProduct.quantity,
            productItemId: product.id,
            product: product,
            productUnit: unit,
            isEdited: false,
            unitId: unit.id,
            unit: unit
          });
          this.restProduct();
          this.measuringUnits = [];
        } else {
          this.alertifyService.error('systemData.product.uniqueItem');
        }
      }
    } else {
      (<any>Object).values((this.addEditForm.get('aggregateProd') as FormGroup).controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  cancalEdit() {
    this.productList.forEach(item => {
      item.isEdited = false;
    })
    this.isEditedProduct = false;
    this.products = [];
    this.measuringUnits = [];
  }

  saveEditProduct(index) {
    if (this.addEditForm.get('aggregateProd').valid) {
      if (this.allProduct != undefined && this.allProduct != null) {
        var purchaseProduct = this.addEditForm.get('aggregateProd').value;
        var product = this.allProduct.filter(x => x.id == purchaseProduct.productItemId)[0];
        var unit = this.measuringUnits.filter(x => x.id == purchaseProduct.measruingUnitId)[0];
        if (this.productList.filter(x => x.productItemId == product.id && x.unitId == unit.id && x.isEdited == false).length < 1) {
          var current = this.productList[index];
          this.isEditedProduct = false;
          current.id = purchaseProduct.id;
          current.measruingUnitId = unit.id;
          current.quantity = purchaseProduct.quantity;
          current.productItemId = product.id;
          current.product = product;
          current.productUnit = unit;
          current.isEdited = false;
          current.unitId = unit.id;
          current.measruingUnitId = unit.id;
          current.unit = unit;
          this.restProduct();
          this.measuringUnits = [];
        } else {
          this.alertifyService.error('systemData.product.uniqueItem');
        }
      }
    } else {
      (<any>Object).values((this.addEditForm.get('aggregateProd') as FormGroup).controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  deleteProducts(index) {
    var current = this.productList[index];
    if (current.id > 0) {
      this.productService.deletAggregateProductById(current.id).subscribe(res => {
        //TODO: Use Success Alert
        this.alertifyService.success('shared.deletedSuccess');
        this.productList.splice(index, 1);
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
    } else {
      this.productList.splice(index, 1);
    }
  }

  editProduct(index) {
    this.productList.forEach(item => {
      item.isEdited = false;
    })
    var current = this.productList[index];
    this.products = [];
    this.measuringUnits = [];
    this.products.push(current.product);
    this.measuringUnits.push(current.unit);
    current.isEdited = true;
    this.isEditedProduct = true;
    (this.addEditForm.get('aggregateProd') as FormGroup).controls['id'].setValue(current.id);
    (this.addEditForm.get('aggregateProd') as FormGroup).controls['measruingUnitId'].setValue(current.measruingUnitId);
    (this.addEditForm.get('aggregateProd') as FormGroup).controls['quantity'].setValue(current.quantity);
    (this.addEditForm.get('aggregateProd') as FormGroup).controls['productItemId'].setValue(current.productItemId);

  }

  // deleteAggregateProduct(index) {
  //   var current = (this.addEditForm.get('aggregateProduct') as FormArray).at(index).value;
  //   if (current.id > 0) {
  //     this.productService.deletAggregateProductById(current.id).subscribe(res => {
  //       //TODO: Use Success Alert
  //       //  this.translate.get('shared.deletedSuccess').subscribe(res => {
  //       this.alertifyService.success('shared.deletedSuccess');
  //       // }); */
  //       //  this.alertInput = new AlertInput("s", "hared.deletedSuccess");
  //       (this.addEditForm.get('aggregateProduct') as FormArray).removeAt(index);
  //     }, error => {
  //       this.alertInput = new AlertInput("f", "error.error500");
  //       //TODO: Use Failure Alert
  //     });
  //   } else {
  //     (this.addEditForm.get('aggregateProduct') as FormArray).removeAt(index);
  //   }
  // }
  // addAggregateProduct() {
  //   const aggregateProduct = this.addEditForm.get('aggregateProduct') as FormArray;
  //   aggregateProduct.push(this.createAggregateProduct());
  // }

}
