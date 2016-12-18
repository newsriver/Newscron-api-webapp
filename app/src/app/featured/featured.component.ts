import { NgModule, Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
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
    public currentSectionName: string = null;
    public positions: any[] = [];



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

    sectionPosition($event) {
        this.positions = this.positions.filter(item => item.name != $event.name);
        this.positions.push($event);
        this.positions.sort((a: any, b: any) => {
            return b.position - a.position;
        });

        //if the page has already been scrolled find the current name
        if (document.body.scrollTop > 0) {
            this.currentSectionName = this.getCurrentSectionName();
        }
    }


    @HostListener("window:scroll", [])
    onWindowScroll() {

        this.currentSectionName = this.getCurrentSectionName();
    }

    private getCurrentSectionName(): string {
        for (let section of this.positions) {
            if (section.position < document.body.scrollTop) {
                return section.name;
            }
        }
        return null;
    }




}
