import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Climber } from 'src/app/core';
import { ClimberService } from 'src/app/core/service/climber.service';


@Component({
  selector: 'app-climber-details',
  templateUrl: './climber-details.component.html',
  styleUrls: ['./climber-details.component.css']
})
export class ClimberDetailsComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject();
  climber: Climber;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private climberService: ClimberService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loadClimber(id);
  }


  loadClimber(id: number) {
    this.climberService.getById(id)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe( climber => {
      this.climber = climber
    });
  }

}
