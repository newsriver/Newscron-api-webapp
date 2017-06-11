import { Component, OnInit, Input, Output, EventEmitter, Pipe, PipeTransform  } from '@angular/core';


@Pipe({
  name: 'editionPerContinent'
})
export class EditionPerContinent implements PipeTransform {
  transform(items: Array<Package>, arg: string): Array<Package> {
    return items.filter(item => item.continent === arg);
  }
}


@Component({
  selector: 'package-selection',
  templateUrl: './package-selection.component.html',
  styleUrls: ['./package-selection.component.css']
})
export class PackageSelectionComponent implements OnInit {
  public packages: Package[] = JSON.parse('[{"name":"Swiss German","id":1,"continent":"EUROPE"},{"name":"Swiss French","id":2,"continent":"EUROPE"},{"name":"Swiss Italian","id":3,"continent":"EUROPE"},{"name":"Germany","id":4,"continent":"EUROPE"},{"name":"Italy","id":5,"continent":"EUROPE"},{"name":"Austria","id":7,"continent":"EUROPE"},{"name":"France","id":9,"continent":"EUROPE"},{"name":"Spain","id":10,"continent":"EUROPE"},{"name":"England","id":11,"continent":"EUROPE"},{"name":"Wales","id":12,"continent":"EUROPE"},{"name":"Scotland","id":13,"continent":"EUROPE"},{"name":"Nortern Ireland","id":14,"continent":"EUROPE"},{"name":"Republic of Ireland","id":15,"continent":"EUROPE"},{"name":"Argentina","id":23,"continent":"SOUTH_AMERICA"},{"name":"Bolivia","id":24,"continent":"SOUTH_AMERICA"},{"name":"Chile","id":25,"continent":"SOUTH_AMERICA"},{"name":"Colombia","id":26,"continent":"SOUTH_AMERICA"},{"name":"Costa Rica","id":27,"continent":"SOUTH_AMERICA"},{"name":"Cuba","id":28,"continent":"SOUTH_AMERICA"},{"name":"Ecuador","id":29,"continent":"SOUTH_AMERICA"},{"name":"El Salvador","id":30,"continent":"SOUTH_AMERICA"},{"name":"Guatemala","id":31,"continent":"SOUTH_AMERICA"},{"name":"Honduras","id":32,"continent":"SOUTH_AMERICA"},{"name":"Mexico","id":33,"continent":"SOUTH_AMERICA"},{"name":"Nicaragua","id":34,"continent":"SOUTH_AMERICA"},{"name":"Paraguay","id":35,"continent":"SOUTH_AMERICA"},{"name":"Perú","id":36,"continent":"SOUTH_AMERICA"},{"name":"Uruguay","id":37,"continent":"SOUTH_AMERICA"},{"name":"Panamá","id":38,"continent":"SOUTH_AMERICA"},{"name":"Venezuela","id":39,"continent":"SOUTH_AMERICA"},{"name":"República Dominicana","id":40,"continent":"SOUTH_AMERICA"},{"name":"USA","id":42,"continent":"NORTH_AMERICA"}]');

  @Input() continent: string;
  @Input() packagesIds: number[];
  @Output() onChange = new EventEmitter<boolean>();

  constructor() {
    this.packages.sort((a: Package, b: Package) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

  }

  ngOnInit() {
    for (let pack of this.packages) {
      if (this.packagesIds.indexOf(pack.id) > -1) {
        pack.selected = true;
      }
    }
  }

  public selectEdition(e) {
    if (e.target.checked) {
      this.addPackage(Number(e.target.value));
    } else {
      this.removePackage(Number(e.target.value));
    }
    this.onChange.emit(true);
  }


  private addPackage(p: number) {
    this.packagesIds.push(p);
  }

  private removePackage(p: number) {
    var index = this.packagesIds.indexOf(p, 0);
    if (index > -1) {
      this.packagesIds.splice(index, 1);
    }
  }


}

export class Package {
  public id: number;
  public name: string = null;
  public continent: string;
  public selected: boolean = false;
}

export class Continent {
  public title: string = null;
  public id: string = null;
  public size: number = null;

}
