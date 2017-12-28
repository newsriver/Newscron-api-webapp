import { Observable } from 'rxjs';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
import { Component, OnInit, Input, Output, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Section, Category, Article, Publisher } from '../../newscron-model';
import { UserProfileService } from '../../user-profile.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'publisher-relevance',
  templateUrl: './publisher-relevance.component.html',
  styleUrls: ['./publisher-relevance.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublisherRelevanceComponent implements OnInit {

  @Input() article: Article;
  public publisherRelevance: number = 0;
  public publisherUserRelevance: number = 0;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private userProfile: UserProfileService, public dialog: MatDialog, private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.publisherUserRelevance = this.userProfile.getPublisherRelevance(this.article.category.id, this.article.publisher.id);
    if (this.article.publisher.relevance != null) {
      this.publisherRelevance = this.article.publisher.relevance
    }
    this.userProfile.getProfileUpdateObserver().takeUntil(this.unsubscribe).subscribe(result => {
      if (result != null && result["publisher-relevance"] != null && result["publisher-relevance"] == this.article.category.id) {
        this.publisherUserRelevance = this.userProfile.getPublisherRelevance(this.article.category.id, this.article.publisher.id);
        this.changeDetector.markForCheck();
      }
    });
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  publisherDialog(publisher: Publisher, category: Category) {
    let dialogRef = this.dialog.open(PublisherDialog, {
      data: { "publisher": publisher, "category": category, "userRelevance": this.publisherUserRelevance }
    }
    );
    dialogRef.afterClosed().takeUntil(this.unsubscribe).subscribe(result => {
      //this.selectedOption = result;
    });
  }

}


@Component({
  selector: 'publisher-dialog',
  templateUrl: './publisher-dialog.html',
  styleUrls: ['./dialog.css']
})
export class PublisherDialog {

  public confirmRemove: boolean = false;
  relevance: string;

  constructor(public dialogRef: MatDialogRef<PublisherDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private userProfile: UserProfileService) {

  }
  remove() {
    this.confirmRemove = true;
  }

  save(relevance: number) {
    this.dialogRef.close('close');
    this.userProfile.setPublishersRelevance(this.data.category.id, this.data.publisher, relevance);
  }
}
