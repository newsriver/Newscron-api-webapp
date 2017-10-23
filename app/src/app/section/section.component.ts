import { NgModule, Component, OnInit, Input, Pipe, PipeTransform, ElementRef, Output, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { Section, Category, Article } from '../newscron-client.service';
import { UserProfileService, PublisherRelevance } from '../user-profile.service';



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
  styleUrls: ['./section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent implements OnInit {

  @Output() sectionPosition = new EventEmitter();
  @Input() section: Section;
  private articles: Article[];

  constructor(private userProfile: UserProfileService, private el: ElementRef, private chageDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.section.category != null) {
      this.sectionPosition.emit({ name: this.section.category.name, position: this.el.nativeElement.offsetTop });
    }
    this.userProfile.getProfileUpdateObserver().subscribe(result => {
      if (result != null && result["publisher-relevance"] != null && result["publisher-relevance"] == this.section.category.id) {
        this.articles = this.filterRemovedPublishers(this.section.articles);
        this.chageDetector.detectChanges();
      }
    });
    this.articles = this.filterRemovedPublishers(this.section.articles);
  }

  private filterRemovedPublishers(articles: Article[]): Article[] {
    let publishersIds: { [id: number]: PublisherRelevance; } = this.userProfile.getRemovedPublishersForCategory(this.section.category.id);
    return this.section.articles.filter(item => publishersIds[item.publisher.id] == null);
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.section.category != null) {
      this.sectionPosition.emit({ name: this.section.category.name, position: this.el.nativeElement.offsetTop });
    }
  }

}
