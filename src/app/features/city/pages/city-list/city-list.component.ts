import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { City } from 'src/app/core';
import { HttpCityService } from 'src/app/core/service/http-city.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { SortableHeaderDirective, SortEvent } from 'src/app/shared';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'],
})
export class CityListComponent implements OnInit, OnDestroy {
  cities: City[];
  currentPage = 1;
  totalItems = 10;
  pageSize = 2;

  destroy$: Subject<boolean> = new Subject();

  constructor(
    private httpCity: HttpCityService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  ngOnInit(): void {
    this.loadCities();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  loadCities() {
    console.log('Pre poziva');
    this.httpCity
      .getByPage(this.currentPage - 1, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.cities = response.content;
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
    this.loadCities();
  }

  onDeleteClick(city: City) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = `Are you sure you want to delete city <strong>${city.name}</strong> ?`;
    modalRef.componentInstance.headerText = 'Deleting city';
    modalRef.result.then(
      // NAPOMENA: Ovde ce samo ako je zadovoljen prvi uslov izvrsiti ovo drugo.
      (result) => result === 'Ok' && this.deleteSelectedCity(city)
    );
  }

  deleteSelectedCity(city: City) {
    this.httpCity.deleteCity(city).subscribe((response) => {
      this.toastService.show(
        'City Deleted ',
        { header: 'Deleting city', classname: 'bg-success text-light' }
      );
      this.loadCities();
    });
  }
}
