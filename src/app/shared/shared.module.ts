import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ObjectInfoPipe } from './pipes';
import { SortableHeaderDirective } from './directives/sortable-header.directive';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalToastComponent } from './components/global-toast/global-toast.component';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';

import { Power ,Pencil, CardText, Trash, Plus, ArrowLeftCircle, Gear } from 'ng-bootstrap-icons/icons';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
const icons = {
  Power, Pencil, CardText, Trash, Plus, ArrowLeftCircle, Gear
};

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ObjectInfoPipe,
    SortableHeaderDirective,
    GlobalToastComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    TranslateModule,
    BootstrapIconsModule.pick(icons)
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    TranslateModule,
    BootstrapIconsModule,

    HeaderComponent,
    FooterComponent,
    GlobalToastComponent,
    ConfirmDialogComponent,
    ObjectInfoPipe,
    SortableHeaderDirective
  ]
})
export class SharedModule { }
