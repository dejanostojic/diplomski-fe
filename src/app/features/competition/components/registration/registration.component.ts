import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationFee } from 'src/app/core/models/competition/registration-fee.model';
import { Registration } from 'src/app/core/models/competition/registration.model';
import { RegistrationModalComponent } from './registration-modal/registration-modal.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @Input() registrations : Registration[];
  filterForm: FormGroup;
  @Input() registrationFees: RegistrationFee[];


  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
   }

  ngOnInit(): void {
    this.buildFilterForm();
  }

  buildFilterForm(){

    this.filterForm = this.fb.group({
      firstName: [],
      lastName: [],
      paid: [],
      registrationOpen: [],
      registrationFee: []
    });
  }

  onDeleteClick(registration: Registration){

    let c = this.registrations.find(r => r.startNumber === registration.startNumber);
    if (c){
      let index = this.registrations.indexOf(c)
      this.registrations.splice(index, 1);
    }

  }

  openInsertNewModal(registration?: Registration){
    let registrationString = registration != null ? JSON.stringify(registration) : "new one";
    console.log("will open modal!" + registrationString);
    console.log(`fees: ${this.registrationFees.length}`);

    const modalRef = this.modalService.open(RegistrationModalComponent);
    modalRef.componentInstance.registrations = this.registrations
    modalRef.componentInstance.fees = this.registrationFees
    if (registration){
      modalRef.componentInstance.registration = registration
    }
  }
}
