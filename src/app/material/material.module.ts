import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
} from '@angular/material';

const modules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
