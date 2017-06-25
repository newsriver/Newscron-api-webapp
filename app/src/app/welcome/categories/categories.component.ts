import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CategoryPreference} from '../../newscron-client.service';

@Component({
  selector: 'welcome-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor() { }
  @Input() categories: CategoryPreference[] = [];
  @Output() onChange = new EventEmitter<any>();

  ngOnInit() {
  }

  public selectCategory($event) {
    this.onChange.emit($event);
  }

}
