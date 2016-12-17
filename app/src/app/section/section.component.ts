import { NgModule, Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import {ArticleComponent} from '../article/article.component';
import {Section, Category, Article} from '../newscron-client.service';

@Pipe({
    name: "sortArticle",
    pure: false
})
export class SortArticle {
    transform(array: Array<Article>, args: string): Array<Article> {
        array.sort((a: Article, b: Article) => {
            return b.publicationDate - a.publicationDate;
        });
        return array;
    }
}



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
