import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
import { NgModule, Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { NewscronClientService, CategoryPreference } from '../newscron-client.service';
import { Section, Category, Article } from '../newscron-model';
import { LoggerService } from '../logger.service';
import { SectionModule, SectionComponent } from '../section/section.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Pipe({
  name: "sortCategory",
  pure: false
})
export class SortCategory {
  transform(array: Array<CategoryPreference>, args: string): Array<CategoryPreference> {
    array = array.filter(item => item.amount > 0)
    array.sort((a: CategoryPreference, b: CategoryPreference) => {
      return b.amount - a.amount;
    });
    return array;
  }
}

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {

  public categoryId: number;
  public sections: Section[];
  public name: string;
  public loading: boolean = true;
  private unsubscribe: Subject<void> = new Subject();
  public error: String = null;

  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router, private chageDetector: ChangeDetectorRef, public logger: LoggerService) {

  }

  ngOnInit() {

    //we need to subscribe to the params changes as the router is not reloading the componet on param changes
    this.route.params.takeUntil(this.unsubscribe).subscribe(params => {

      this.categoryId = params.id;
      this.name = params.name;
      this.logger.trackPage("/category/" + this.name.toLowerCase());
      this.loading = true;
      this.sections = null;
      this.chageDetector.markForCheck();

      this.client.category(this.categoryId).subscribe(section => {
        this.sections = [];
        this.sections.push(section);
        this.loading = false;
        this.chageDetector.markForCheck();
      }
        , error => {
          this.loading = false;
          console.log(error);
          this.error = "Unable to load news. Please make sure your devie is connected to Internet and try again.";
          this.chageDetector.markForCheck();
        }
      );

    });
  }


  public loadMore() {

    let timestamp: number = Number.MAX_VALUE;
    for (let article of this.sections[this.sections.length - 1].articles) {
      if (article.publicationDate < timestamp) {
        timestamp = article.publicationDate;
      }
    }

    this.loading = true;
    this.client.category(this.categoryId, timestamp).takeUntil(this.unsubscribe).subscribe(section => {
      this.sections.push(section);
      this.loading = false;
      this.chageDetector.markForCheck();
    }
      , error => {
        this.loading = false;
        console.log(error);
        this.error = "Unable to load news. Please make sure your devie is connected to Internet and try again.";
      }
    );
  }



  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    SectionModule
  ],
  exports: [CategoryComponent, SortCategory],
  declarations: [CategoryComponent, SortCategory],
  providers: [NewscronClientService, LoggerService],
})
export class CategoryModule { }
