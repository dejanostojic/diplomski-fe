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
import { CompetitionSearchCriteria, Competition } from 'src/app/core';
import { CompetitionService } from 'src/app/core/service/competition.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-competition-list',
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.css']
})
export class CompetitionListComponent implements OnInit, OnDestroy {
  competitions: Competition[];
  currentPage = 1;
  totalItems = 10;
  pageSize = 2;
  filterForm: FormGroup;
  searchCriteria = new CompetitionSearchCriteria();

  destroy$: Subject<boolean> = new Subject();

  constructor(
    private competitionService: CompetitionService,
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
    this.loadCompetitions();
  }


  ngOnDestroy() {
    this.destroy$.next(true);
  }


  buildFilterForm() {
    let paramMap = this.route.snapshot.queryParams;
    console.log("paramMap: " + JSON.stringify(paramMap));
    this.searchCriteria.name = paramMap.name;
    
      if(paramMap.registrationOpen != undefined && paramMap.registrationOpen !== "" && new Boolean(paramMap.registrationOpen)){
        this.searchCriteria.registrationOpen = new Boolean(paramMap.registrationOpen);
      }
      else{
        this.searchCriteria.registrationOpen = null;
        
    }
    

    this.filterForm = this.fb.group({
      name: [this.searchCriteria.name],
      registrationOpen: [this.searchCriteria.registrationOpen]
    });

  }



  loadCompetitions(){
    console.log('Pre poziva');
    /*this.competitionService
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
      let response =  this.competitionService
      .getByPage(this.currentPage - 1, this.pageSize, this.searchCriteria)
      .subscribe((response) => {
        console.log("RESPONSE FROM SERVICE: " + JSON.stringify(response))
        this.competitions = response.content;
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
    this.loadCompetitions();
  }

  onFilterApplied(){
    console.log("filter applied")
    console.log("filter applied " + JSON.stringify(this.filterForm.value))
    
    if (this.filterForm.valid){
      console.log("valid form")
      this.searchCriteria = this.filterForm.value;
    
      let filter = "?filter=true" 
      filter += this.searchCriteria.name  ? `&firstName=${this.searchCriteria?.name}` : ""; 
      filter += this.searchCriteria.registrationOpen ? `&lastName=${this.searchCriteria?.registrationOpen}` : "";
      
      this.router.navigate([], {relativeTo: this.route, queryParams: this.searchCriteria})
      
      this.loadCompetitions();
    }else {
      console.log("not valid form")
    }
    
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
        'Competition deleted ',
        { header: 'Deleting competition', classname: 'bg-success text-light' }
      );
      this.loadCompetitions();
    },
    err => {
      this.toastService.show(
        'Competition not deleted',
        { header: 'Error deleting competition', classname: 'bg-danger text-light' }
      );
    });
  }

}
