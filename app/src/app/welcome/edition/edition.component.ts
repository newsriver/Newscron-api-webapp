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
  public continetName: string = "";

  ngOnInit() {
    if (this.continent === 'EUROPE') {
      this.continetName = "Europe";
    }
    if (this.continent === 'NORTH_AMERICA') {
      this.continetName = "North America";
    }
    if (this.continent === 'SOUTH_AMERICA') {
      this.continetName = "South America";
    }

  }


  public onPackageChange($event) {
    this.onChange.emit(this.packagesIds);
  }

}
