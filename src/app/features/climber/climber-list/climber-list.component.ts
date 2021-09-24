import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClimberSearchCriteria } from 'src/app/core';
import { Climber } from 'src/app/core/models/climber.model';
import { ClimberService } from 'src/app/core/service/climber.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-climber-list',
  templateUrl: './climber-list.component.html',
  styleUrls: ['./climber-list.component.css']
})
export class ClimberListComponent implements OnInit, OnDestroy {
  climbers: Climber[];
  currentPage = 1;
  totalItems = 10;
  pageSize = 2;
  filterForm: FormGroup;
  searchCriteria = new ClimberSearchCriteria();

  destroy$: Subject<boolean> = new Subject();

  constructor(
    private climberService: ClimberService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  ngOnInit(): void {
    this.buildFilterForm();
    this.loadClimbers();
  }


  ngOnDestroy() {
    this.destroy$.next(true);
  }


  buildFilterForm() {
    let paramMap = this.route.snapshot.queryParams;
    console.log("paramMap: " + JSON.stringify(paramMap));
    this.searchCriteria.firstName = paramMap.firstName;
    this.searchCriteria.lastName = paramMap.lastName;
    
      if(paramMap.yearOfBirth && paramMap.yearOfBirth !== "" && !isNaN(Number(paramMap.yearOfBirth))){
        this.searchCriteria.yearOfBirth = Number(paramMap.yearOfBirth);
      }
      else{
        this.searchCriteria.yearOfBirth = null;
        
    }
    

    this.filterForm = this.fb.group({
      firstName: [this.searchCriteria.firstName],
      lastName: [this.searchCriteria.lastName],
      yearOfBirth: [this.searchCriteria.yearOfBirth, [this.isNumericValidator()]]
    });

  }


  // todo move this in separate file
  isNumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined){
        return null;
      }
      const numeric = new RegExp("^[0-9]*$").test(control.value);
      return !numeric ? {numeric: {value: control.value, message: "This field must be number!"}} : null;
    };
  }

  loadClimbers(){
    console.log('Pre poziva');
    /*this.climberService
      .getByPage(this.currentPage - 1, this.pageSize)
      // .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.cities = response.content;
        this.totalItems = response.totalElements;
        this.pageSize = response.size;
        this.currentPage = response.number + 1;
        console.log('Nakon stizanja podataka ')
      });
      */
     console.log(JSON.stringify(this.searchCriteria))
      let response =  this.climberService
      .getByPage(this.currentPage - 1, this.pageSize, this.searchCriteria)
      .subscribe((response) => {
        this.climbers = response.content;
        this.totalItems = response.totalElements;
        this.pageSize = response.size;
        this.currentPage = response.number + 1;
        console.log('Nakon stizanja podataka ')
      });


      console.log('Nakon poziva');
  }

  onSort(event: SortEvent) {
    console.log('sort event', event);

    this.headers.forEach((header) => {
      if (header.sortable !== event.column) {
        header.direction = '';
      }
    });

    // TODO: call paging and sorting endpoint
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadClimbers();
  }

  onFilterApplied(){
    console.log("filter applied")
    console.log("filter applied " + JSON.stringify(this.filterForm.value))
    
    if (this.filterForm.valid){
      console.log("valid form")
      this.searchCriteria = this.filterForm.value;
    
      let filter = "?filter=true" 
      filter += this.searchCriteria.firstName  ? `&firstName=${this.searchCriteria?.firstName}` : ""; 
      filter += this.searchCriteria.lastName ? `&lastName=${this.searchCriteria?.lastName}` : "";
      filter += this.searchCriteria.yearOfBirth ? `&yearOfBirth=${this.searchCriteria?.yearOfBirth}` : "";
      
      this.router.navigate([], {relativeTo: this.route, queryParams: this.searchCriteria})
      
      this.loadClimbers();
    }else {
      console.log("not valid form")
    }
    
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
        'Climber deleted ',
        { header: 'Deleting climber', classname: 'bg-success text-light' }
      );
      this.loadClimbers();
    },
    err => {
      this.toastService.show(
        'Climber not deleted',
        { header: 'Error deleting climber', classname: 'bg-danger text-light' }
      );
    });
  }

}
