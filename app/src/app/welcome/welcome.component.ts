import { Component, OnInit, Input, Output, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import {NewscronClientService, BootstrapConfiguration, Category} from '../newscron-client.service';
import {MdSliderModule} from '@angular2-material/slider';


@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {
    transform(items: any, args: any[]): any {
        return Object.keys(items);
    }
}

@Pipe({
    name: 'categoryAmmount'
})
export class CategoryAmmountPipe implements PipeTransform {
    transform(item: any, args: any[]): any {
        switch (item) {
            case 5:
                return "few";
            case 10:
                return "some";
            case 15:
                return "standard";
            case 20:
                return "many";
            case 25:
                return "extreme";
            default:
                return "none";
        }
    }
}



@Component({
    selector: 'welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    providers: [MdSliderModule]
})

export class WelcomeComponent implements OnInit {

    @Output() setWelcomeStep = new EventEmitter();

    public continent: string;
    public step: number = 0;
    public bootConfig: BootstrapConfiguration;
    public packages: Package[] = JSON.parse('[{"name":"Swiss German","id":1,"continent":"EUROPE"},{"name":"Swiss French","id":2,"continent":"EUROPE"},{"name":"Swiss Italian","id":3,"continent":"EUROPE"},{"name":"Germany","id":4,"continent":"EUROPE"},{"name":"Italy","id":5,"continent":"EUROPE"},{"name":"Austria","id":7,"continent":"EUROPE"},{"name":"France","id":9,"continent":"EUROPE"},{"name":"Spain","id":10,"continent":"EUROPE"},{"name":"England","id":11,"continent":"EUROPE"},{"name":"Wales","id":12,"continent":"EUROPE"},{"name":"Scotland","id":13,"continent":"EUROPE"},{"name":"Nortern Ireland","id":14,"continent":"EUROPE"},{"name":"Republic of Ireland","id":15,"continent":"EUROPE"},{"name":"Argentina","id":23,"continent":"SOUTH_AMERICA"},{"name":"Bolivia","id":24,"continent":"SOUTH_AMERICA"},{"name":"Chile","id":25,"continent":"SOUTH_AMERICA"},{"name":"Colombia","id":26,"continent":"SOUTH_AMERICA"},{"name":"Costa Rica","id":27,"continent":"SOUTH_AMERICA"},{"name":"Cuba","id":28,"continent":"SOUTH_AMERICA"},{"name":"Ecuador","id":29,"continent":"SOUTH_AMERICA"},{"name":"El Salvador","id":30,"continent":"SOUTH_AMERICA"},{"name":"Guatemala","id":31,"continent":"SOUTH_AMERICA"},{"name":"Honduras","id":32,"continent":"SOUTH_AMERICA"},{"name":"Mexico","id":33,"continent":"SOUTH_AMERICA"},{"name":"Nicaragua","id":34,"continent":"SOUTH_AMERICA"},{"name":"Paraguay","id":35,"continent":"SOUTH_AMERICA"},{"name":"Perú","id":36,"continent":"SOUTH_AMERICA"},{"name":"Uruguay","id":37,"continent":"SOUTH_AMERICA"},{"name":"Panamá","id":38,"continent":"SOUTH_AMERICA"},{"name":"Venezuela","id":39,"continent":"SOUTH_AMERICA"},{"name":"República Dominicana","id":40,"continent":"SOUTH_AMERICA"},{"name":"USA","id":42,"continent":"NORTH_AMERICA"}]');
    public continents: { [key: string]: Package[] } = {};
    constructor(private client: NewscronClientService) {
    }

    ngOnInit() {
        this.step = 1;

        this.client.getCategories().subscribe(categories => {
            if (categories == null) {
                this.client.boot(null).subscribe(bootConfig => {
                    if (bootConfig != null) {
                        this.bootConfig = bootConfig;
                        this.packages.sort((a: Package, b: Package) => {
                            if (a.name < b.name) return -1;
                            if (a.name > b.name) return 1;
                            return 0;
                        });
                        let _continents: { [key: string]: Package[] } = {};
                        for (let p of this.packages) {
                            if (this.bootConfig.packagesIds.indexOf(p.id) > -1) {
                                p.selected = true;
                            }
                            let _packages: Package[] = _continents[p.continent];
                            if (_packages == null) {
                                _packages = [];
                            }
                            _packages.push(p);
                            _continents[p.continent] = _packages;
                        }
                        this.continents = _continents;
                    }
                });
            } else {
                this.bootConfig = new BootstrapConfiguration();
                this.bootConfig.categories = categories;
                this.packages.sort((a: Package, b: Package) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
                let _continents: { [key: string]: Package[] } = {};
                for (let p of this.packages) {
                    for (let c of categories) {
                        if (c.packages.indexOf(p.id) > -1) {
                            p.selected = true;
                            break;
                        }
                    }
                    let _packages: Package[] = _continents[p.continent];
                    if (_packages == null) {
                        _packages = [];
                    }
                    _packages.push(p);
                    _continents[p.continent] = _packages;
                }
                this.continents = _continents;
            }
        });



    }

    setContinent(name: string) {
        this.continent = name;
        this.step++;
        this.setWelcomeStep.emit(this.step);
    }

    back() {
        this.step--;
        this.setWelcomeStep.emit(this.step);
    }

    next() {
        this.step++;
        this.setWelcomeStep.emit(this.step);
    }

    finish() {
        this.step = -1;
        this.client.setCategories(this.bootConfig.categories);
        this.setWelcomeStep.emit(this.step);
    }


    public selectEdition(e) {
        if (e.target.checked) {
            this.addPackage(Number(e.target.value));
        } else {
            this.removePackage(Number(e.target.value));
        }
    }

    private addPackage(p: number) {
        this.bootConfig.packagesIds.push(p);
        this.boot(this.bootConfig.packagesIds);
    }

    private removePackage(p: number) {
        var index = this.bootConfig.packagesIds.indexOf(p, 0);
        if (index > -1) {
            this.bootConfig.packagesIds.splice(index, 1);
        }
        this.boot(this.bootConfig.packagesIds);
    }


    private boot(packagesIds: number[]) {
        this.client.boot(packagesIds).subscribe(bootConfig => {
            this.bootConfig = bootConfig;
        });
    }

}

export class Package {
    public id: number;
    public name: string = null;
    public continent: string;
    public selected: boolean = false;
}
