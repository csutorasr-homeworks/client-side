import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatExpansionModule,
} from '@angular/material';

const modules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatExpansionModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
