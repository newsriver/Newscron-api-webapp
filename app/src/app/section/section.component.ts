import { NgModule, Component, OnInit, Input, Pipe, PipeTransform, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
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


@Component({
    selector: 'section',
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

    @Output() sectionPosition = new EventEmitter();
    @Input() section: Section;

    constructor(private el: ElementRef) {

    }

    ngOnInit() {
        this.sectionPosition.emit({ name: this.section.category.name, position: this.el.nativeElement.offsetTop });
    }


    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.sectionPosition.emit({ name: this.section.category.name, position: this.el.nativeElement.offsetTop });
    }

}
