import { Component, Input, OnInit } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent implements OnInit {
  @Input() headerText: string;
  @Input() message: string;

  returnFunction: Function;

  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {}

  onCancel() {
    // this.returnFunction('cancel');
    this.modal.close('Cancel');
  }

  onConfirm() {
    // this.returnFunction('confirm');
    this.modal.close('Ok');
  }
}
