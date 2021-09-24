import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { City } from 'src/app/core';
import { HttpCityService } from 'src/app/core/service/http-city.service';

@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.component.html',
  styleUrls: ['./city-details.component.css']
})
export class CityDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  city: City;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private httpCity: HttpCityService) { }

  ngOnInit(): void {
    const postalCode = +this.route.snapshot.paramMap.get('postalCode');
    this.loadCity(postalCode);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  loadCity(postalCode: number) {
    this.httpCity.getById(postalCode)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( city => {
      this.city = city
    });
  }

}
