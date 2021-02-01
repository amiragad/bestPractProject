import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { FullRoutes } from '../../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddEditCategory } from '../../shared/data/AddEdit-category.model';
import { AlertInput } from '../../../../../../shared/alerts/alert-input';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BaseObject } from '../../../../../../modules/accounting/suppliers/shared/data/base-object.model';
import { SystemParameterDTO } from '../../../../../../modules/accounting/shared/models/system-parameter.model';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  providers:[CategoryService]
})
export class AddCategoryComponent implements OnInit {

  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.basicData'},
    {url:'', label:'sideNav.category'},
    {url:'', label:'sideNav.addCategory'}
  ];
  addEditForm: FormGroup;
  autoCoding: string;
  addEditModel: AddEditCategory;
  alertInput: AlertInput = new AlertInput();
  attchement: File;
  fileName: string;
  imageSrc: string = '/assets/images/icons/thumbnail.jpg';
  parentList: BaseObject[];
  id: any;
  constructor(private categoryService:CategoryService,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
   }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]!=undefined)
      this.findbyId(params["id"]);
      this.getCategories(params["id"]);
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
    //  const formData: FormData = new FormData();
      this.addEditModel = Object.assign({}, this.addEditForm.value);
     /*    for(let property in  this.addEditModel ) 
       { 
         if(this.addEditForm.controls[property].value!=null)
          formData.append(property,this.addEditForm.controls[property].value);
       } 
   */
    // if(this.attchement!=null)
     //  formData.append('file',this.attchement,this.attchement.name);
        this.categoryService.addEdit(this.addEditForm.value).subscribe(res=> {
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
      parentId:[null],
      file:[null],
      nameRepeate: [null],
      fileExtention: [null]
    });
  }
  addEdit(){
    debugger
    if(this.addEditForm.valid){
      this.ngxService.startBackground();
       // const formData: FormData = new FormData();
        this.addEditModel = Object.assign({}, this.addEditForm.value);
       /*    for(let property in  this.addEditModel ) 
         { 
           if(this.addEditForm.controls[property].value!=null)
            formData.append(property,this.addEditForm.controls[property].value);
         } 
     */
     /*   if(this.attchement!=null)
         formData.append('file',this.attchement,this.attchement.name);
          */
          this.categoryService.addEdit(this.addEditForm.value).subscribe(res=> {
         //   this.router.navigate(['/'+FullRoutes.STOCK_MODULE+'/'+FullRoutes.SYSTEM_DATA+'/'+FullRoutes.CATEGORY_LIST]); 
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
    this.router.navigate(['../../../'+FullRoutes.CATEGORY_LIST],{ relativeTo: this.activatedRoute });
     else
    this.router.navigate(['../../'+FullRoutes.CATEGORY_LIST],{ relativeTo: this.activatedRoute });
   // this.router.navigate(['/'+FullRoutes.STOCK_MODULE+'/'+FullRoutes.SYSTEM_DATA+'/'+FullRoutes.CATEGORY_LIST]);
  }
  handleFileInput(event){
    for (let file of event) {
      this.attchement = file;
      this.fileName = this.attchement.name;
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
    debugger
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

  findbyId(id)
  {
    this.ngxService.start();
    this.categoryService.findById(id)
    .subscribe((res: AddEditCategory) => {
      this.addEditModel = res;
      this.addEditForm.patchValue(this.addEditModel);
      this.imageSrc = res.productImage;
        this.fileName = res.imageName;
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
  getCategories(id) {
    this.categoryService.getParentList(id==undefined?0:id)
      .subscribe((res: BaseObject[]) => {
        this.parentList = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
  }

  getSystemCoding() {
    this.categoryService.getSystemParameter('systemCoding')
      .subscribe((res: SystemParameterDTO) => {
        this.autoCoding=res.value;
        if(this.autoCoding!="1")
        {
          this.addEditForm.get('code').setValidators([Validators.required,Validators.maxLength(100)]);
          this.addEditForm.get('code').updateValueAndValidity();
        }
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
  }
}
