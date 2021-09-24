import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationFee } from 'src/app/core/models/competition/registration-fee.model';
import { RegistrationFeeModalComponent } from './registration-fee-modal/registration-fee-modal.component';

@Component({
  selector: 'app-registration-fee',
  templateUrl: './registration-fee.component.html',
  styleUrls: ['./registration-fee.component.css']
})
export class RegistrationFeeComponent implements OnInit {
  @Input() registrationFees : RegistrationFee[];
  registrationFeeCount = 1;
  
  constructor(
    private modalService: NgbModal
  ) {
    /*
    this.registrationFees = [{   
      ord: 1,
      name: "Early birds",
      amount: 100.00,
      startDate: new Date(),
      endDate: new Date()
  },
  {   
    ord: 2,
    name: "Regular",
    amount: 200.00,
    startDate: new Date(),
    endDate: new Date()
},{   
  ord: 3,
  name: "Last minute",
  amount: 300.00,
  startDate: new Date(),
  endDate: new Date()
}
];*/
   }

  ngOnInit(): void {
  }
  

  increseFeesCount(){
    this.registrationFeeCount++;
    console.log("Fee count: " + this.registrationFeeCount);


  }

  onDeleteClick(regFee: RegistrationFee){

    let c = this.registrationFees.find(r => r.competitionId === regFee.competitionId &&   r.ord === regFee.ord);
    if (c){
      let index = this.registrationFees.indexOf(c)
      this.registrationFees.splice(index, 1);
    }

  }

  openInsertNewModal(regFee?: RegistrationFee){
    let fee = regFee != null ? JSON.stringify(regFee) : "new one";
    console.log("will open modal!" + fee);
    
    
    const modalRef = this.modalService.open(RegistrationFeeModalComponent);
    modalRef.componentInstance.registrationFees = this.registrationFees
    if (regFee){
      modalRef.componentInstance.registrationFee = regFee
    }
  }

  registrationFeeChange(regFee: RegistrationFee){
    
  }

}
