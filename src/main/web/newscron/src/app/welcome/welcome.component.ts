import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NewscronClientService, BootstrapConfiguration, Category} from '../newscron-client.service';


@Component({
    selector: 'welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    providers: []
})
export class WelcomeComponent implements OnInit {

    @Output() closeWelcome = new EventEmitter();

    public step: number = 0;
    public bootConfig: BootstrapConfiguration;
    public packages: Package[] = JSON.parse('[{	"id" : 23,	"name" : "Argentina",	"language" : 4,	"rootPackage" : null},{	"id" : 7,	"name" : "Austria",	"language" : 1,	"rootPackage" : null},{	"id" : 8,	"name" : "Belgium French",	"language" : 2,	"rootPackage" : null},{	"id" : 24,	"name" : "Bolivia",	"language" : 4,	"rootPackage" : null},{	"id" : 25,	"name" : "Chile",	"language" : 4,	"rootPackage" : null},{	"id" : 26,	"name" : "Colombia",	"language" : 4,	"rootPackage" : null},{	"id" : 27,	"name" : "Costa Rica",	"language" : 4,	"rootPackage" : null},{	"id" : 28,	"name" : "Cuba",	"language" : 4,	"rootPackage" : null},{	"id" : 29,	"name" : "Ecuador",	"language" : 4,	"rootPackage" : null},{	"id" : 30,	"name" : "El Salvador",	"language" : 4,	"rootPackage" : null},{	"id" : 11,	"name" : "England",	"language" : 3,	"rootPackage" : null},{	"id" : 9,	"name" : "France",	"language" : 2,	"rootPackage" : null},{	"id" : 4,	"name" : "Germany",	"language" : 1,	"rootPackage" : null},{	"id" : 31,	"name" : "Guatemala",	"language" : 4,	"rootPackage" : null},{	"id" : 32,	"name" : "Honduras",	"language" : 4,	"rootPackage" : null},{	"id" : 5,	"name" : "Italy",	"language" : 0,	"rootPackage" : null},{	"id" : 33,	"name" : "Mexico",	"language" : 4,	"rootPackage" : null},{	"id" : 22,	"name" : "New Zealand",	"language" : 3,	"rootPackage" : null},{	"id" : 34,	"name" : "Nicaragua",	"language" : 4,	"rootPackage" : null},{	"id" : 14,	"name" : "Nortern Ireland",	"language" : 3,	"rootPackage" : null},{	"id" : 49,	"name" : "Pakistan",	"language" : 3,	"rootPackage" : null},{	"id" : 38,	"name" : "Panamá",	"language" : 4,	"rootPackage" : null},{	"id" : 35,	"name" : "Paraguay",	"language" : 4,	"rootPackage" : null},{	"id" : 36,	"name" : "Perú",	"language" : 4,	"rootPackage" : null},{	"id" : 15,	"name" : "Republic of Ireland",	"language" : 3,	"rootPackage" : null},{	"id" : 40,	"name" : "República Dominicana",	"language" : 4,	"rootPackage" : null},{	"id" : 13,	"name" : "Scotland",	"language" : 3,	"rootPackage" : null},{	"id" : 10,	"name" : "Spain",	"language" : 4,	"rootPackage" : null},{	"id" : 2,	"name" : "Swiss French",	"language" : 2,	"rootPackage" : null},{	"id" : 1,	"name" : "Swiss German",	"language" : 1,	"rootPackage" : null},{	"id" : 3,	"name" : "Swiss Italian",	"language" : 0,	"rootPackage" : null},{	"id" : 37,	"name" : "Uruguay",	"language" : 4,	"rootPackage" : null},{	"id" : 42,	"name" : "USA",	"language" : 3,	"rootPackage" : null},{	"id" : 39,	"name" : "Venezuela",	"language" : 4,	"rootPackage" : null},{	"id" : 12,	"name" : "Wales",	"language" : 3,	"rootPackage" : null}]');

    constructor(private client: NewscronClientService) {
    }

    ngOnInit() {
        this.step = 0;

        this.client.boot(null).subscribe(bootConfig => {
            if (bootConfig != null) {
                this.bootConfig = bootConfig;
                this.packages.sort((a: Package, b: Package) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
                for (let p of this.packages) {
                    if (this.bootConfig.packagesIds.indexOf(p.id) > -1) {
                        p.selected = true;
                    }
                }
            }
        });
    }

    next() {
        this.step++;
    }

    finish() {
        this.step++;
        this.client.setCategories(this.bootConfig.categories);
        this.closeWelcome.emit();
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
    public language: number;
    public rootPackage: number;
    public selected: boolean = false;
}
