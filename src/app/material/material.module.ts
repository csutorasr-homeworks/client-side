import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatSnackBarModule,
} from '@angular/material';

const modules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatSnackBarModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
