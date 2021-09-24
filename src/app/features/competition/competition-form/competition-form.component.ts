import { AfterViewInit, COMPILER_OPTIONS, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { translate } from '@angular/localize/src/translate';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Competition, FormMode, FormUtils } from 'src/app/core';
import { CompetitionService } from 'src/app/core/service/competition.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { RegistrationFeeComponent } from '../components/registration-fee/registration-fee.component';
import DatePickerConverter from 'src/app/shared/utils/date-picker-converter';
import { RouteComponent } from '../components/route/route.component';
import { RegistrationComponent } from '../components/registration/registration.component';


@Component({
  selector: 'app-competition-form',
  templateUrl: './competition-form.component.html',
  styleUrls: ['./competition-form.component.css']
})
export class CompetitionFormComponent implements OnInit, AfterViewInit{
  destroy$: Subject<boolean> = new Subject();
  competition: Competition;
  formMode: FormMode;
  competitionForm: FormGroup;
  enabledChanges = false;
  error = null;
  formTitleKey = null;
  customData: String;
  regFee: RegistrationFeeComponent;
  routeComp: RouteComponent;
  registrationComp: RegistrationComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private translate: TranslateService
    ) { }

  ngOnInit(): void {
    this.prepareData();
  }

  @ViewChild(RegistrationFeeComponent)
  set regFeeView(regFee: RegistrationFeeComponent) {
    this.regFee = regFee;
    console.log("after @ViewChild RegistrationFeeComponent")
  };

  @ViewChild(RouteComponent)
  set routeView(routeComp: RouteComponent) {
    this.routeComp = routeComp;
    console.log("after @ViewChild RouteComponent")
  };

  @ViewChild(RegistrationComponent)
  set registrationView(registrationComp : RegistrationComponent) {
    this.registrationComp = registrationComp;
    console.log("after @ViewChild RouteComponent")
  };


  ngAfterViewInit() {
    console.log("begining ngAfterViewIni")
    // console.log("reg fee count" + this.regFee.registrationFeeCount);
  }

  increaseChildVal(){
    this.regFee.increseFeesCount();
  }

  getDataFromRegFee(){
    console.log("get data from rf: " + this.regFee.registrationFeeCount);
  }

  prepareData() {
    // Ovde se uzimaju podaci sa rute. Mogu se dodati staticki i dinamicki.
    // pogledajte city-routing.module.ts fajl

    this.fetchAndPrepareCompetition();
    this.prepareRegistrationFees();

  }

  fetchAndPrepareCompetition(){
    console.log("got form mode: " + this.route.snapshot.data.formMode);
    console.log("got cusgtom data : " + this.route.snapshot.data.customData);


    console.log("translate for COMPETITION.NAME: " + JSON.stringify(this.translate.instant("COMPETITION.NAME")));
    // if new competition than set form mode from provided data, not from path  param 
    this.formMode = this.route.snapshot.data.formMode != undefined ? FormMode[this.route.snapshot.data.formMode] : FormMode[this.route.snapshot.paramMap.get('mode')];

    this.setFormTitleKey(this.formMode);
    this.enabledChanges = this.formMode in [FormMode.FORM_ADD, FormMode.FORM_EDIT];

    if (FormUtils.shouldFetchData(this.formMode)) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.loadCompetition(id);
    } else {
      this.competition = {} as Competition;
      this.competition.registrationFees = [];
      this.competition.routes = [];
      this.competition.registrations = [];
      this.buildForm(false);
    }

  }

  prepareRegistrationFees(){
    // convert date strings to js date objects;
    // this.competition.registrationFees.forEach(fee => {
    //   fee.startDate = new Date(fee.startDate);
    //   fee.endDate = new Date(fee.endDate);
    // });
  }

  loadCompetition(id: number) {
    this.competitionService.getById(id)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( competition => {
      console.log("got competition: " + JSON.stringify(competition))
      console.log("loaded competition reg open: " + JSON.stringify(DatePickerConverter.toPickerDate(competition.registrationOpen)))

      this.competition = competition
      this.buildForm(this.formMode === FormMode.FORM_VIEW ,this.competition);
    });
  }
// yyyy-MM-dd'T'HH:mm:ss.SS'Z
  // toPickerDate(d: Date ){
  //   console.log("to picker date: " + d.toString())
  //   if (d) {
  //     return {
  //       day : d.getDate(),
  //       month : d.getMonth() + 1,
  //       year :  d.getFullYear()
  //     };
  //   }
  //   return null;
  // }
  
  // toPickerTime(d: Date ){
  //   if (d) {
  //     return {
  //       hour : d.getHours(),
  //       minute : d.getMinutes()
  //     };
  //   }
  //   return null;
  // } 

  buildForm(disabled: boolean, competition?:Competition) {
    let d = new Date();
    console.log("build log: ")
    if (competition){
      console.log(`build log: ${JSON.stringify(competition)}`);
      console.log(`type of registration open: ${typeof(competition.registrationOpen)}`)
      console.log(`build log registration open: ${competition.registrationOpen?.toUTCString()}`);
    }
    let pickerFormat = (competition && competition.registrationOpen) ? DatePickerConverter.toPickerDate(competition.registrationOpen) : null ;
    console.log(`build log registration open date picker format: ${JSON.stringify(pickerFormat)}`);
    this.competitionForm = this.fb.group({
      id: [competition? competition.id: null],
      name: [competition? competition.name: null, [Validators.required]],
      description: [competition? competition.description: null, [Validators.required]],
      registrationOpenDate: [(competition && competition.registrationOpen) ? DatePickerConverter.toPickerDate(competition.registrationOpen) : null, [Validators.required]],
      registrationOpenTime: [(competition && competition.registrationOpen) ? DatePickerConverter.toPickerTime(competition.registrationOpen): null, Validators.required],
      registrationCloseDate: [(competition && competition.registrationClose) ? DatePickerConverter.toPickerDate(competition.registrationClose): null, [Validators.required]],
      registrationCloseTime: [(competition && competition.registrationClose) ? DatePickerConverter.toPickerTime(competition.registrationClose) : null, Validators.required]

      // yearOfBirth: [competition? competition.yearOfBirth: null, [this.isNumericValidator(), Validators.min(1900), Validators.max((new Date()).getFullYear() - 10)]]
    });
    if (disabled){
      this.competitionForm.disable();
    }else{
      this.competitionForm.enable();
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
    this.competitionForm.enable();
  }
  
  setFormTitleKey(formMode: FormMode) {
  
    switch(formMode){
      case FormMode.FORM_ADD: this.formTitleKey = "COMPETITION.TITLE_INSERT"; break;
      case FormMode.FORM_EDIT: this.formTitleKey = "COMPETITION.TITLE_UPDATE"; break;
      case FormMode.FORM_VIEW: this.formTitleKey = "COMPETITION.TITLE_VIEW"; 
    }
  
  }

  cancelAction(){
    this.router.navigate(['/competition/competition-list']);
  }

  // formControlsToZuluString(dateF: string, timeF: string){
  //   let v = this.competitionForm.value
  //   console.log(`date: ${v[dateF]}`)
  //   console.log(`time: ${v[timeF]}`)
  //   /*
  //   registrationOpen":{"year":2021,"month":8,"day":5},
  //   "registrationOpenTime":{"hour":1,"minute":1,"second":0}
  //   */
  //   let date = v[dateF];
  //   let time = v[timeF];

  //  console.log(`selected date: ${date["year"]}-${date["month"]}-${date["day"]}`)
  //  console.log(`selected time: ${time["hour"]}:${time["minute"]}`)
  //  let year = date['year'];
  //  let month = this.getZeroPrefixDateField("" + date["month"])
  //  let day = this.getZeroPrefixDateField("" + date["day"])
  //  let hour = this.getZeroPrefixDateField("" + time["hour"])
  //  let minute = this.getZeroPrefixDateField("" + time["minute"])
   
  //  let zuluFormat= `${year}-${month}-${day}T${hour}:${minute}:00.00Z`
  //  console.log(`zulu: ${zuluFormat}`);
  //  return zuluFormat;
  // }

  getModelFromFrom(){
    let compForm = Object.assign({}, this.competitionForm.value);
    let regFees = JSON.stringify(this.regFee.registrationFees)
    console.log("original val" + JSON.stringify(this.competitionForm.value));
    console.log("cloned value" + JSON.stringify(this.competitionForm.value));
    console.log("reg fees: " + regFees);
    console.log("routeComp: " + JSON.stringify(this.routeComp.routes));

    let openDate = DatePickerConverter.formControlsToZuluString(this.competitionForm, 'registrationOpenDate', 'registrationOpenTime');
    let closeDate = DatePickerConverter.formControlsToZuluString(this.competitionForm, 'registrationCloseDate', 'registrationCloseTime');
    //let closeDate = this.formControlsToZuluString('registrationCloseD', 'registrationOpenTime');
    compForm.registrationOpen = openDate;
    compForm.registrationClose = closeDate;

    delete compForm['registrationOpenDate']
    delete compForm['registrationOpenTime']

    delete compForm['registrationCloseDate']
    delete compForm['registrationCloseTime']

    compForm.registrationFees = this.regFee.registrationFees
    compForm.routes = this.routeComp.routes
    compForm.registrations = this.registrationComp.registrations
    
    // compForm.routes = this.routes.routes


    return compForm;
  }

  updateAction() {
    
    if(this.validateForm()){
      let compFormVal = this.getModelFromFrom();
      

      this.competitionService.updateCompetition(compFormVal).subscribe((response) => {
        this.toastService.show(
          'Updated competition' + response.name,
          { header: 'Updated competition', classname: 'bg-success text-light' }
        );
        // this.router.navigate(['/competition/competition-form', response., ]);
      },
      err => {
        this.toastService.show(
          'Competition not updated',
          { header: 'Error updating', classname: 'bg-danger text-light' }
        );
      });;
    }

  }

  validateForm() {    
    if (!this.competitionForm.valid){
      this.competitionForm.markAllAsTouched();
      console.log("form not valid");
      this.showFormNotValidToast();
      return false;
    }
    return true;
  }


  insertAction() {

    if (!this.validateForm()){
      return;
    }
    let compFormVal = this.getModelFromFrom()
    console.log("insert action" + JSON.stringify(compFormVal))

    return this.competitionService.insertCompetition(compFormVal).subscribe((response) => {
      this.toastService.show(
        'Inserted competition ' + response.name,
        { header: 'Inserting competition success', classname: 'bg-success text-light' }
      );
      this.router.navigate(['/competition/competition-form/', response.id, "FORM_VIEW" ]);
    },
    err => {
      this.toastService.show(
        'Competition not inserted',
        { header: 'Error inserting competition', classname: 'bg-danger text-light' }
      );
    });
  }

  onDeleteClick(competition: Competition) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = `Are you sure you want to delete competition <strong>${competition.name}</strong> ?`;
    modalRef.componentInstance.headerText = 'Deleting competition';
    modalRef.result.then(
      // NAPOMENA: Ovde ce samo ako je zadovoljen prvi uslov izvrsiti ovo drugo.
      (result) => result === 'Ok' && this.deleteSelectedCompetition(competition)
    );
  }


  deleteSelectedCompetition(competition: Competition) {
    this.competitionService.deleteCompetition(competition).subscribe((response) => {
      this.toastService.show(
        'Competition Deleted ',
        { header: 'Deleting competition', classname: 'bg-success text-light' }
      );
      this.router.navigate(['/competition/competition-list']);
    },
    err => {
      this.toastService.show(
        'Competition not deleted',
        { header: 'Error deleting', classname: 'bg-danger text-light' }
      );
    });
  }


  hasErrors(componentName: string, errorCode: string) {
    return  (this.competitionForm.get(componentName).dirty || this.competitionForm.get(componentName).touched) && this.competitionForm.get(componentName).hasError(errorCode);
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

  getZeroPrefixDateField(val: string){
    if (!val) return null;
    return ("0" + val).slice(-2);
  }

}


