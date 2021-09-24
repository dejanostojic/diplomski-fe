import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { City } from 'src/app/core';
import { HttpCityService } from 'src/app/core/service/http-city.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-city-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.css']
})
export class CityFormComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject();
  cityForm: FormGroup;
  edit: false;
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private httpCity: HttpCityService,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.prepareData();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }



  prepareData() {
    // Ovde se uzimaju podaci sa rute. Mogu se dodati staticki i dinamicki.
    // pogledajte city-routing.module.ts fajl
    this.edit = this.route.snapshot.data.edit;
    if (this.edit) {
      const postalCode = +this.route.snapshot.paramMap.get('postalCode');
      this.loadCity(postalCode);
    } else {
      this.buildForm();
    }
  }


  loadCity(postalCode: number) {
    this.httpCity.getById(postalCode)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( city => {
      console.log(city);
      this.buildForm(city);
    });
  }

  buildForm(city?:City) {
    this.cityForm = this.fb.group({
      postalCode: [city? city.postalCode: null, [Validators.min(1000), Validators.max(1000000),Validators.required]],
      name: [city? city.name: null, [Validators.required]]
    });
  }


  saveCity() {
    if (this.edit) {
      return this.httpCity.updateCity(this.cityForm.value)
    } else {
      return this.httpCity.insertCity(this.cityForm.value)
    }
  }

  onSubmit() {
    this.saveCity()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      city => {
        this.toastService.show('City saved!', {header:'Saving city', classname: 'bg-success text-light'});
        this.router.navigate(['/city/city-list'])
      },
      error => {
        this.toastService.show('City is not saved: ' + (typeof error.error === 'string'? error.error : error.mesage ) , {header:'Saving city', classname: 'bg-danger text-light'});
      }

    );
  }

  hasErrors(componentName: string, errorCode: string) {
    return  (this.cityForm.get(componentName).dirty || this.cityForm.get(componentName).touched) && this.cityForm.get(componentName).hasError(errorCode);
  }

}
