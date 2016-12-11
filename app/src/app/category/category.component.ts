import { NgModule, Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {NewscronClientService, Section, Category, Article} from '../newscron-client.service';


@NgModule({
    declarations: []
})

@Component({
    selector: 'category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

    public categoryId: number;
    public section: Section;
    public name: string;
    public loading: boolean = true;
    constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.categoryId = Number(params['id']);
            this.name = params['name'];

            this.client.getCategories().subscribe(categories => {
                if (categories != null) {
                    for (let category of categories) {
                        if (category.id == this.categoryId) {
                            this.loading = true;
                            this.section = null;
                            this.client.category(category).subscribe(section => {
                                this.section = section;
                                this.loading = false;
                            });
                        }
                    }
                }
            });

        });
    }
}
