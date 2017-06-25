import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'welcome-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {

  constructor() { }
  @Output() onChange = new EventEmitter<string>();

  ngOnInit() {
  }

  setContinent(name: string) {
    this.onChange.emit(name);
  }


}
