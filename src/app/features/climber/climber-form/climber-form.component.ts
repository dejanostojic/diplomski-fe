import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { translate } from '@angular/localize/src/translate';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Climber, FormMode, FormUtils } from 'src/app/core';
import { ClimberService } from 'src/app/core/service/climber.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-climber-form',
  templateUrl: './climber-form.component.html',
  styleUrls: ['./climber-form.component.css']
})
export class ClimberFormComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject();
  climber: Climber;
  formMode: FormMode;
  climberForm: FormGroup;
  enabledChanges = false;
  error = null;
  formTitleKey = null;
  customData: String;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private climberService: ClimberService,
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


    console.log("translate for CLIMBER.FIRST_NAME: " + JSON.stringify(this.translate.instant("CLIMBER.FIRST_NAME")));
    // if new climber than set form mode from provided data, not from path  param 
    this.formMode = this.route.snapshot.data.formMode != undefined ? FormMode[this.route.snapshot.data.formMode] : FormMode[this.route.snapshot.paramMap.get('mode')];

    this.setFormTitleKey(this.formMode);
    this.enabledChanges = this.formMode in [FormMode.FORM_ADD, FormMode.FORM_EDIT];

    if (FormUtils.shouldFetchData(this.formMode)) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.loadClimber(id);
    } else {
      this.buildForm(false);
    }
  }

  loadClimber(id: number) {
    this.climberService.getById(id)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( climber => {
      console.log("got climber: " + JSON.stringify(climber))
      this.climber = climber
      this.buildForm(this.formMode === FormMode.FORM_VIEW ,this.climber);
    });
  }

  buildForm(disabled: boolean, climber?:Climber) {
    this.climberForm = this.fb.group({
      id: [climber? climber.id: null],
      firstName: [climber? climber.firstName: null, [Validators.required]],
      lastName: [climber? climber.lastName: null, [Validators.required]],
      yearOfBirth: [climber? climber.yearOfBirth: null, [this.isNumericValidator(), Validators.min(1900), Validators.max((new Date()).getFullYear() - 10)]]
    });
    if (disabled){
      this.climberForm.disable();
    }else{
      this.climberForm.enable();
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
    this.climberForm.enable();
  }
  
  setFormTitleKey(formMode: FormMode) {
  
    switch(formMode){
      case FormMode.FORM_ADD: this.formTitleKey = "CLIMBER.TITLE_INSERT"; break;
      case FormMode.FORM_EDIT: this.formTitleKey = "CLIMBER.TITLE_UPDATE"; break;
      case FormMode.FORM_VIEW: this.formTitleKey = "CLIMBER.TITLE_VIEW"; 
    }
  
  }

  cancelAction(){
    this.router.navigate(['/climber/climber-list']);
  }


  updateAction() {
    
    if(this.validateForm()){
      console.log("update action" + JSON.stringify(this.climberForm.value));
      this.climberService.updateClimber(this.climberForm.value).subscribe((response) => {
        this.toastService.show(
          'Updated climber' + response.firstName,
          { header: 'Updated climber', classname: 'bg-success text-light' }
        );
        // this.router.navigate(['/climber/climber-form', response., ]);
      },
      err => {
        this.toastService.show(
          'Climber not updated',
          { header: 'Error updating', classname: 'bg-danger text-light' }
        );
      });;
    }

  }

  validateForm() {
    if (!this.climberForm.valid){
      this.climberForm.markAllAsTouched();
      console.log("form not valid");
      this.showFormNotValidToast();
      return false;
    }
    return true;
  }


  insertAction() {
    console.log("insert action" + JSON.stringify(this.climberForm.value))

    if (!this.validateForm()){
      return;
    }

    return this.climberService.insertClimber(this.climberForm.value).subscribe((response) => {
      this.toastService.show(
        'Inserted climber ' + response.firstName,
        { header: 'Inserting climber success', classname: 'bg-success text-light' }
      );
      this.router.navigate(['/climber/climber-form/', response.id, "FORM_VIEW" ]);
    },
    err => {
      this.toastService.show(
        'Climber not inserted',
        { header: 'Error inserting climber', classname: 'bg-danger text-light' }
      );
    });
  }

  onDeleteClick(climber: Climber) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = `Are you sure you want to delete climber <strong>${climber.firstName} ${climber.lastName}</strong> ?`;
    modalRef.componentInstance.headerText = 'Deleting climber';
    modalRef.result.then(
      // NAPOMENA: Ovde ce samo ako je zadovoljen prvi uslov izvrsiti ovo drugo.
      (result) => result === 'Ok' && this.deleteSelectedClimber(climber)
    );
  }


  deleteSelectedClimber(climber: Climber) {
    this.climberService.deleteClimber(climber).subscribe((response) => {
      this.toastService.show(
        'Climber Deleted ',
        { header: 'Deleting climber', classname: 'bg-success text-light' }
      );
      this.router.navigate(['/climber/climber-list']);
    },
    err => {
      this.toastService.show(
        'Climber not deleted',
        { header: 'Error deleting', classname: 'bg-danger text-light' }
      );
    });
  }


  hasErrors(componentName: string, errorCode: string) {
    return  (this.climberForm.get(componentName).dirty || this.climberForm.get(componentName).touched) && this.climberForm.get(componentName).hasError(errorCode);
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


