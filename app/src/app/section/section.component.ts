import { NgModule, Component, OnInit, Input, Pipe, PipeTransform, ElementRef, Output, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ArticleModule, ArticleComponent } from '../article/article.component';
import { Section, Category, Article, Publisher } from '../newscron-model';
import { NewscronClientService } from '../newscron-client.service';
import { UserProfileService } from '../user-profile.service';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Pipe({
  name: "sortArticle",
  pure: false
})
export class SortArticle {
  transform(array: Array<Article>, args: string): Array<Article> {
    array.sort((a: Article, b: Article) => {
      if (b.publisher != null && a.publisher != null) {
        return b.publisher.relevance - a.publisher.relevance;
      } else {
        return b.publicationDate - a.publicationDate;
      }
    });
    return array;
  }
}

@Pipe({
  name: 'validSection'
})
export class ValidSectionFilter implements PipeTransform {


  constructor(public client: NewscronClientService) {

  }

  transform(items: Array<Section>, args: any[]): Array<Section> {
    items = items.filter(item => item.articles.length > 0);
    items.sort((a: Section, b: Section) => {
      let cata = this.client.getUserPreferences().getCategory(a.category.id);
      let catb = this.client.getUserPreferences().getCategory(b.category.id);
      return (catb == null ? 0 : catb.amount) - (cata == null ? 0 : cata.amount);
    });
    return items;
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
  @Input()  section: Section;
  public articles: Article[];

  constructor(private userProfile: UserProfileService, private el: ElementRef, private chageDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.section.category != null) {
      this.sectionPosition.emit({ name: this.section.category.name, position: this.el.nativeElement.offsetTop });
    }
    if (this.section.category != null) {
      this.userProfile.getProfileUpdateObserver().subscribe(result => {
        if (result != null && result["publisher-relevance"] != null && result["publisher-relevance"] == this.section.category.id) {
          this.articles = this.filterRemovedPublishers(this.section.articles);
          this.chageDetector.detectChanges();
        }
      });
    }
    this.articles = this.filterRemovedPublishers(this.section.articles);
  }

  private filterRemovedPublishers(articles: Article[]): Article[] {

    if (this.section.category == null) {
      /* TODO: eventually one day once all results from search will have a publisher id
      //if section category is not assiged (e.g. search) filter each article based on its own category
      return this.section.articles.filter(item => {
        let publishersIds: { [id: number]: Publisher; } = this.userProfile.getRemovedPublishersForCategory(item.category.id);
        return publishersIds[item.publisher.id] == null;
      }*/
      return this.section.articles;
    }
    let publishersIds: { [id: number]: Publisher; } = this.userProfile.getRemovedPublishersForCategory(this.section.category.id);
    return this.section.articles.filter(item => publishersIds[item.publisher.id] == null);
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.section.category != null) {
      this.sectionPosition.emit({ name: this.section.category.name, position: this.el.nativeElement.offsetTop });
    }
  }
}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    ArticleModule
  ],
  exports: [SectionComponent, ValidSectionFilter, SortArticle,SectionHeaderComponent],
  declarations: [SectionComponent, SortArticle, ValidSectionFilter,SectionHeaderComponent],
  providers: [UserProfileService, NewscronClientService],
})
export class SectionModule { }
