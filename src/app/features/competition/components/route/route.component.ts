import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from 'src/app/core/models/competition/route.model';
import { RouteModalComponent } from './route-modal/route-modal.component';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  @Input() routes : Route[];

  constructor(
    private modalService: NgbModal
  ) {
   }

  ngOnInit(): void {
  }


  onDeleteClick(route: Route){

    let c = this.routes.find(r => r.competitionId === route.competitionId &&   r.ord === route.ord);
    if (c){
      let index = this.routes.indexOf(c)
      this.routes.splice(index, 1);
    }

  }

  openInsertNewModal(route?: Route){
    let routeString = route != null ? JSON.stringify(route) : "new one";
    console.log("will open modal!" + routeString);

    const modalRef = this.modalService.open(RouteModalComponent);
    modalRef.componentInstance.routes = this.routes
    if (route){
      modalRef.componentInstance.route = route
    }
  }
}
