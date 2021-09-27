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
import { AdminSearchCriteria } from 'src/app/core';
import { Admin } from 'src/app/core/models/admin.model';
import { AdminService } from 'src/app/core/service/admin.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit, OnDestroy {
  admins: Admin[];
  currentPage = 1;
  totalItems = 10;
  pageSize = 10;
  filterForm: FormGroup;
  searchCriteria = new AdminSearchCriteria();

  destroy$: Subject<boolean> = new Subject();

  constructor(
    private adminService: AdminService,
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
    this.loadAdmins();
  }


  ngOnDestroy() {
    this.destroy$.next(true);
  }


  buildFilterForm() {
    let paramMap = this.route.snapshot.queryParams;
    console.log("paramMap: " + JSON.stringify(paramMap));
    this.searchCriteria.firstName = paramMap.firstName;
    this.searchCriteria.lastName = paramMap.lastName;
    this.searchCriteria.username = paramMap.username;
 

    this.filterForm = this.fb.group({
      firstName: [this.searchCriteria.firstName],
      lastName: [this.searchCriteria.lastName],
      username: [this.searchCriteria.username]
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

  loadAdmins(){
    console.log('Pre poziva');
    /*this.adminService
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
      let response =  this.adminService
      .getByPage(this.currentPage - 1, this.pageSize, this.searchCriteria)
      .subscribe((response) => {
        this.admins = response.content;
        this.totalItems = response.totalElements;
        // this.pageSize = response.size;
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
    this.loadAdmins();
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
      filter += this.searchCriteria.username ? `&username=${this.searchCriteria?.username}` : "";
      
      this.router.navigate([], {relativeTo: this.route, queryParams: this.searchCriteria})
      
      this.loadAdmins();
    }else {
      console.log("not valid form")
    }
    
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
        'Admin deleted ',
        { header: 'Deleting admin', classname: 'bg-success text-light' }
      );
      this.loadAdmins();
    },
    err => {
      this.toastService.show(
        'Admin not deleted',
        { header: 'Error deleting admin', classname: 'bg-danger text-light' }
      );
    });
  }

}
