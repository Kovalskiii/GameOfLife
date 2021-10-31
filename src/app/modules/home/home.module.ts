import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {HomeComponent} from "./page/home.component";
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../../shared/material/material.module";


@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: HomeComponent}]),
    MaterialModule,
  ]
})
export class HomeModule { }
