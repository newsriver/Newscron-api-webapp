import { NgModule, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {SectionComponent} from '../section/section.component';
import {NewscronClientService, Section, Category, Article} from '../newscron-client.service';



@NgModule({
    declarations: [SectionComponent]
})

@Component({
    selector: 'featured',
    templateUrl: './featured.component.html',
    styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit {


    public sections: Section[] = [];
    public loading: boolean = true;
    constructor(private client: NewscronClientService) { }

    ngOnInit() {
        this.client.getCategories().subscribe(categories => {
            if (categories != null) {
                this.sections = [];
                this.loading = true;
                this.client.featured(categories).subscribe(sections => {
                    this.sections = sections;
                    this.loading = false;
                });
            }
        });
    }


}
