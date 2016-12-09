import { NgModule, Component, OnInit, Input } from '@angular/core';
import {ArticleComponent} from '../article/article.component';
import {Section, Category, Article} from '../newscron-client.service';

@NgModule({
    declarations: [ArticleComponent]
})

@Component({
    selector: 'section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {


    @Input() section: Section;

    constructor() {

    }

    ngOnInit() {
    }

}
