import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationFee } from 'src/app/core/models/competition/registration-fee.model';
import DatePickerConverter from 'src/app/shared/utils/date-picker-converter';
import { ToastService } from 'src/app/core/service/toast.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-registration-fee-modal',
  templateUrl: './registration-fee-modal.component.html',
  styleUrls: ['./registration-fee-modal.component.css']
})
export class RegistrationFeeModalComponent implements OnInit {
  @Input() registrationFees: RegistrationFee[];
  @Input() registrationFee: RegistrationFee;
  @Input() isNew: boolean;

  @Output() registrationFeeChange = new EventEmitter<RegistrationFee>();


  registrationFeeForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastService: ToastService,
    private modalService: NgbModal,
    private translate: TranslateService

    ) { }

  ngOnInit(): void {
    console.log("on modal init");
    console.log(`registration fees: ${JSON.stringify(this.registrationFees)}`);
    console.log(`selected fee: ${JSON.stringify(this.registrationFee)}`);
    this.buildForm(this.registrationFee ? this.registrationFee: null)
  }

  buildForm(fee?:RegistrationFee) {
    this.registrationFeeForm = this.fb.group({
      // competitionId: [fee? fee.competitionId: this.competitionId],
      ord: [ fee? fee.ord : this.registrationFees.length + 1,[this.isNumericValidator, Validators.required]],
      name: [fee? fee.name: null, [Validators.required]],
      amount: [fee? fee.amount: null, [this.isNumericValidator(), Validators.required]],
      startDateField: [(fee && fee.startDate) ? DatePickerConverter.toPickerDate(fee.startDate) : null, [Validators.required]],
      endDateField: [(fee && fee.endDate) ? DatePickerConverter.toPickerDate(fee.endDate) : null, [Validators.required]]
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
      let fee = Object.assign({}, this.registrationFeeForm.value);

  
      let openDate = DatePickerConverter.formControlsToDate(this.registrationFeeForm, 'startDateField');
      let closeDate = DatePickerConverter.formControlsToDate(this.registrationFeeForm, 'endDateField');
      //let closeDate = this.formControlsToZuluString('registrationCloseD', 'registrationOpenTime');
      fee.startDate = openDate;
      fee.endDate = closeDate;
  
      delete fee['startDateField']
      delete fee['endDateField']
  
      delete fee['registrationCloseDate']
      delete fee['registrationCloseTime']
  
      return fee;
    }


  showFormNotValidToast(){
    this.toastService.show(
      'Fix errors and try again',
      { header: 'Form not valid', classname: 'bg-danger text-light' }
    );
  }

    validateForm() {
      if (!this.registrationFeeForm.valid){
        this.registrationFeeForm.markAllAsTouched();
        console.log("form not valid");
        this.showFormNotValidToast();
        return false;
      }
      return true;
    }

    
    onConfirm(){
      
      if (!this.validateForm()){
        return;
      }
      console.log("Confirm save");
      let fee = this.getModelFromFrom();
      
      console.log(`model from form: ${JSON.stringify(fee)}`)
      // this.registrationFees.splice(0,1);
      let index = this.registrationFees.findIndex(c => c.ord === fee.ord);
      console.log(`index: ${index}`);
      if (index != -1){
        console.log(`reg fees before: ${JSON.stringify(this.registrationFees)}`);
        this.registrationFees.splice(index, 1, fee);
        console.log(`reg fees after: ${JSON.stringify(this.registrationFees)}`);
      } else {
        this.registrationFees.push(fee)
      }

      this.modalService.dismissAll();
    }

    hasErrors(componentName: string, errorCode: string) {
      return  (this.registrationFeeForm.get(componentName).dirty || this.registrationFeeForm.get(componentName).touched) && this.registrationFeeForm.get(componentName).hasError(errorCode);
    }
  
}
