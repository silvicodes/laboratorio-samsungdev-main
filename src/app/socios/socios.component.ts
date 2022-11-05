import { Component } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  standalone: true,
  selector: '[app-socios]',
  exportAs: 'appsocios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class SociosComponent {
  constructor() {}
  ngOnInit () {}
}
