import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'welcome-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  constructor() { }
  @Input() continent: string;
  @Input() packagesIds: number[];
  @Output() onChange = new EventEmitter<number[]>();

  ngOnInit() {
  }

  public onPackageChange($event) {
    this.onChange.emit(this.packagesIds);
  }

}
