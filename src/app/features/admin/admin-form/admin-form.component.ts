import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { translate } from '@angular/localize/src/translate';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Admin, FormMode, FormUtils } from 'src/app/core';
import { AdminService } from 'src/app/core/service/admin.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject();
  admin: Admin;
  formMode: FormMode;
  adminForm: FormGroup;
  enabledChanges = false;
  error = null;
  formTitleKey = null;
  customData: String;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.prepareData();
  }


  prepareData() {
    // Ovde se uzimaju podaci sa rute. Mogu se dodati staticki i dinamicki.
    // pogledajte city-routing.module.ts fajl
    console.log("got form mode: " + this.route.snapshot.data.formMode);
    console.log("got cusgtom data : " + this.route.snapshot.data.customData);


    console.log("translate for ADMIN.FIRST_NAME: " + JSON.stringify(this.translate.instant("ADMIN.FIRST_NAME")));
    // if new admin than set form mode from provided data, not from path  param 
    this.formMode = this.route.snapshot.data.formMode != undefined ? FormMode[this.route.snapshot.data.formMode] : FormMode[this.route.snapshot.paramMap.get('mode')];

    this.setFormTitleKey(this.formMode);
    this.enabledChanges = this.formMode in [FormMode.FORM_ADD, FormMode.FORM_EDIT];

    if (FormUtils.shouldFetchData(this.formMode)) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.loadAdmin(id);
    } else {
      this.buildForm(false);
    }
  }

  loadAdmin(id: number) {
    this.adminService.getById(id)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( admin => {
      console.log("got admin: " + JSON.stringify(admin))
      this.admin = admin
      this.buildForm(this.formMode === FormMode.FORM_VIEW ,this.admin);
    }, error => this.error = "System can not load Admin!");
  }

  buildForm(disabled: boolean, admin?:Admin) {
    this.adminForm = this.fb.group({
      id: [admin? admin.id: null],
      firstName: [admin? admin.firstName: null, [Validators.required]],
      lastName: [admin? admin.lastName: null, [Validators.required]],
      username: [admin? admin.username: null, [Validators.required]],
      password: [admin? admin.password: null, []]
    });
    if (disabled){
      this.adminForm.disable();
    }else{
      this.adminForm.enable();
    }
  }


  isEnabled(inputComp: String){
    switch (inputComp){
      case "buttonDelete":{
        let deleteEnabled = this.enabledChanges && this.formMode in [FormMode.FORM_VIEW, FormMode.FORM_EDIT] ;
        return deleteEnabled;
      }
      case "buttonEdit": return this.enabledChanges && this.formMode === FormMode.FORM_EDIT;
      case "buttonEnableChanges": return !this.enabledChanges && this.formMode === FormMode.FORM_VIEW;
      case "buttonSave":  return this.enabledChanges && this.formMode === FormMode.FORM_ADD; 
      default : return false;
    }
    // return true;
  }

  enableChanges(){
    this.enabledChanges = true;
    this.formMode = FormMode.FORM_EDIT;
    this.adminForm.enable();
  }
  
  setFormTitleKey(formMode: FormMode) {
  
    switch(formMode){
      case FormMode.FORM_ADD: this.formTitleKey = "ADMIN.TITLE_INSERT"; break;
      case FormMode.FORM_EDIT: this.formTitleKey = "ADMIN.TITLE_UPDATE"; break;
      case FormMode.FORM_VIEW: this.formTitleKey = "ADMIN.TITLE_VIEW"; 
    }
  
  }

  cancelAction(){
    this.router.navigate(['/admin/admin-list']);
  }


  updateAction() {
    
    if(this.validateForm()){
      console.log("update action" + JSON.stringify(this.adminForm.value));
      this.adminService.updateAdmin(this.adminForm.value).subscribe((response) => {
        this.toastService.show(
          'Updated admin' + response.firstName,
          { header: 'Updated admin', classname: 'bg-success text-light' }
        );
        // this.router.navigate(['/admin/admin-form', response., ]);
      },
      err => {
        this.toastService.show(
          'Admin not updated',
          { header: 'Error updating', classname: 'bg-danger text-light' }
        );
      });;
    }

  }

  validateForm() {
    if (!this.adminForm.valid){
      this.adminForm.markAllAsTouched();
      console.log("form not valid");
      this.showFormNotValidToast();
      return false;
    }
    return true;
  }


  insertAction() {
    console.log("insert action" + JSON.stringify(this.adminForm.value))

    if (!this.validateForm()){
      return;
    }

    return this.adminService.insertAdmin(this.adminForm.value).subscribe((response) => {
      this.toastService.show(
        'Inserted admin ' + response.firstName,
        { header: 'Inserting admin success', classname: 'bg-success text-light' }
      );
      this.router.navigate(['/admin/admin-form/', response.id, "FORM_VIEW" ]);
    },
    err => {
      this.toastService.show(
        'Admin not inserted',
        { header: 'Error inserting admin', classname: 'bg-danger text-light' }
      );
    });
  }

  onDeleteClick(admin: Admin) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = `Are you sure you want to delete admin <strong>${admin.firstName} ${admin.lastName}</strong> ?`;
    modalRef.componentInstance.headerText = 'Deleting admin';
    modalRef.result.then(
      // NAPOMENA: Ovde ce samo ako je zadovoljen prvi uslov izvrsiti ovo drugo.
      (result) => result === 'Ok' && this.deleteSelectedAdmin(admin)
    );
  }


  deleteSelectedAdmin(admin: Admin) {
    this.adminService.deleteAdmin(admin).subscribe((response) => {
      this.toastService.show(
        'Admin Deleted ',
        { header: 'Deleting admin', classname: 'bg-success text-light' }
      );
      this.router.navigate(['/admin/admin-list']);
    },
    err => {
      this.toastService.show(
        'Admin not deleted',
        { header: 'Error deleting', classname: 'bg-danger text-light' }
      );
    });
  }


  hasErrors(componentName: string, errorCode: string) {
    return  (this.adminForm.get(componentName).dirty || this.adminForm.get(componentName).touched) && this.adminForm.get(componentName).hasError(errorCode);
  }


  showFormNotValidToast(){
    this.toastService.show(
      'Fix errors and try again',
      { header: 'Form not valid', classname: 'bg-danger text-light' }
    );
  }

  // todo move this in separate file
  isNumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const numeric = new RegExp("^[0-9]*$").test(control.value);
      return !numeric ? {numeric: {value: control.value, message: "This field must be number!"}} : null;
    };
  }

}


