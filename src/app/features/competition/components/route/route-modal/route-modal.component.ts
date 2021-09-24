import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from 'src/app/core/models/competition/route.model';
import { ToastService } from 'src/app/core/service/toast.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-route-modal',
  templateUrl: './route-modal.component.html',
  styleUrls: ['./route-modal.component.css']
})
export class RouteModalComponent implements OnInit {
  @Input() routes: Route[];
  @Input() route: Route;
  @Input() isNew: boolean;

  @Output() RouteChange = new EventEmitter<Route>();


  routeForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastService: ToastService,
    private modalService: NgbModal,
    private translate: TranslateService

    ) { }

  ngOnInit(): void {
    console.log("on modal init");
    console.log(` routes: ${this.routes}`);
    console.log(`selected route: ${this.route}`);
    this.buildForm(this.route ? this.route: null)
  }

  buildForm(route?:Route) {
    this.routeForm = this.fb.group({
      // competitionId: [route? route.competitionId: this.competitionId],
      ord: [route? route.ord: this.routes.length + 1, [this.isNumericValidator, Validators.required]], // todo: check how to disable 
      name: [route? route.name: null, [Validators.required]],
      grade: [route? route.grade: null],
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
      let route = Object.assign({}, this.routeForm.value);

      return route;
    }


    showFormNotValidToast(){
      this.toastService.show(
        'Fix errors and try again',
        { header: 'Form not valid', classname: 'bg-danger text-light' }
      );
    }

    validateForm() {
      if (!this.routeForm.valid){
        this.routeForm.markAllAsTouched();
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
      let route = this.getModelFromFrom();
      

      // this.Routes.splice(0,1);
      let index = this.routes.findIndex(c => c.ord === route.ord);
      console.log(`index: ${index}`);
      if (index != -1){
        console.log(`reg routes before: ${JSON.stringify(this.routes)}`);
        this.routes.splice(index, 1, route);
        console.log(`reg routes after: ${JSON.stringify(this.routes)}`);
      } else {
        this.routes.push(route)
      }

      this.modalService.dismissAll();
    }

    hasErrors(componentName: string, errorCode: string) {
      return  (this.routeForm.get(componentName).dirty || this.routeForm.get(componentName).touched) && this.routeForm.get(componentName).hasError(errorCode);
    }
  
}
