import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import DatePickerConverter from 'src/app/shared/utils/date-picker-converter';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Registration } from 'src/app/core/models/competition/registration.model';
import { ToastService } from 'src/app/core/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Climber } from 'src/app/core';
import { ChooseClimberComponent } from './climber-list/choose-climber.component';
import { RegistrationFee } from 'src/app/core/models/competition/registration-fee.model';


@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.css']
})
export class RegistrationModalComponent implements OnInit {
  @Input() registrations: Registration[];
  @Input() registration: Registration;
  @Input() fees: RegistrationFee[];
  @Input() isNew: boolean;

  @Output() RegistrationChange = new EventEmitter<Registration>();


  registrationForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastService: ToastService,
    private modalService: NgbModal,
    private translate: TranslateService

    ) { }

  ngOnInit(): void {
    console.log("on modal init");
    console.log(` registrations: ${this.registrations}`);
    console.log(`selected registration: ${this.registration}`);
    console.log(`fees: ${this.fees.length}`);
    console.log(`fees: ${JSON.stringify(this.fees)}`);
    
    this.buildForm(this.registration ? this.registration: null)
  }

  buildForm(registration?:Registration) {
    this.registrationForm = this.fb.group({
      // competitionId: [registration? registration.competitionId: this.competitionId],
      climber: [registration? registration.climber: null],
      climberName: [registration? (registration.climber.firstName + " " + registration.climber?.lastName) : null],
      startNumber: [registration? registration.startNumber: null, [Validators.required]],
      paid: [registration? registration.paid: null],
      createdDate: [registration? registration.createdDate: null],
      paidDate: [registration? registration.paidDate: null],
      createdDateField: [(registration && registration.createdDate) ? DatePickerConverter.toPickerDate(registration.createdDate) : null, [Validators.required]],
      paidDateField: [(registration && registration.paidDate) ? DatePickerConverter.toPickerDate(registration.paidDate) : null, [Validators.required]],

      fee: [registration? registration.registrationFee.ord: null, [Validators.required]],
    });
    
  }

    // todo move this in separate file
    isNumericValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const numeric = new RegExp("^[0-9]*$").test(control.value);
        return !numeric ? {numeric: {value: control.value, message: "This field must be number!"}} : null;
      };
    }

    onCancel(){
      this.modalService.dismissAll();
    }

    getModelFromFrom(){
      let registration = Object.assign({}, this.registrationForm.value);

      return registration;
    }


    showFormNotValidToast(){
      this.toastService.show(
        'Fix errors and try again',
        { header: 'Form not valid', classname: 'bg-danger text-light' }
      );
    }

    validateForm() {
      if (!this.registrationForm.valid){
        this.registrationForm.markAllAsTouched();
        console.log("form not valid");


        // print errors
        Object.keys(this.registrationForm.controls).forEach(key => {

          const controlErrors: ValidationErrors = this.registrationForm.get(key).errors;
          if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                  console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
              }
            });
        
        // print errors end


        this.showFormNotValidToast();
        return false;
      }
      return true;
    }

    openChooseClimberModal(climber? : Climber){
      let registrationString = climber != null ? JSON.stringify(climber) : "new one";
      console.log("will open modal!" + registrationString);
  
      const modalRef = this.modalService.open(ChooseClimberComponent);
      modalRef.componentInstance.registrations = this.registrations
      if (climber){
        modalRef.componentInstance.selected = climber
      }
      modalRef.result.then(
        // NAPOMENA: Ovde ce samo ako je zadovoljen prvi uslov izvrsiti ovo drugo.
        (result) => result !== null && result !== undefined && this.chooseClimberFromModal(result)
      );
    }

    chooseClimberFromModal(selectedClimber: Climber){
      console.log("in registration modal component choose from parent modal" + JSON.stringify(selectedClimber));
      this.registrationForm.controls['climber'].setValue(selectedClimber);
      this.registrationForm.controls['climberName'].setValue(`${selectedClimber.firstName} ${selectedClimber.lastName}`);
    }

    onConfirm(){
      
      if (!this.validateForm()){
        return;
      }
      console.log("Confirm save");
      let registration = this.getModelFromFrom();
      

      // this.Registrations.splice(0,1);
      let index = this.registrations.findIndex(c => c.startNumber === registration.startNumber);
      console.log(`index: ${index}`);
      if (index != -1){
        console.log(`reg registrations before: ${JSON.stringify(this.registrations)}`);
        this.registrations.splice(index, 1, registration);
        console.log(`reg registrations after: ${JSON.stringify(this.registrations)}`);
      } else {
        this.registrations.push(registration)
      }

      this.modalService.dismissAll();
    }

    hasErrors(componentName: string, errorCode: string) {
      return  (this.registrationForm.get(componentName).dirty || this.registrationForm.get(componentName).touched) && this.registrationForm.get(componentName).hasError(errorCode);
    }
  
}
