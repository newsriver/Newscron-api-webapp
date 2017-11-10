import { NgModule, Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef,Pipe, PipeTransform } from '@angular/core';
import { RouterModule,Router, ActivatedRoute, Params } from '@angular/router';
import { NewscronClientService ,CategoryPreference} from '../newscron-client.service';
import { Section, Category, Article } from '../newscron-model';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { SectionModule,SectionComponent } from '../section/section.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  public section: Section;
  public name: string;
  public loading: boolean = true;
  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router, private chageDetector: ChangeDetectorRef, public ga: GoogleAnalyticsService) {

  }

  ngOnInit() {

    //we need to subscribe to the params changes as the router is not reloading the componet on param changes
    this.route.params.subscribe(params => {

      this.categoryId = params.id;
      this.name = params.name;
      this.ga.trackPage("/category/" + this.name.toLowerCase());
      this.loading = true;
      this.section = null;
      this.chageDetector.markForCheck();

      this.client.category(this.categoryId).subscribe(section => {
        this.section = section;
        this.loading = false;
        this.chageDetector.markForCheck();
      });

    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
    SectionModule
  ],
  exports: [CategoryComponent,SortCategory],
  declarations: [CategoryComponent,SortCategory],
  providers: [NewscronClientService,GoogleAnalyticsService],
})
export class CategoryModule {}
