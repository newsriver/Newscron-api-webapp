import { Component, OnInit, Input, Output, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Section, Category, Article, Publisher } from '../../newscron-model';
import { Observable } from 'rxjs';
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
  public publisherUserRelevance: number = 0;
  constructor(private userProfile: UserProfileService, public dialog: MatDialog, private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.publisherUserRelevance = this.userProfile.getPublisherRelevance(this.article.category.id, this.article.publisher.id);
    this.userProfile.getProfileUpdateObserver().subscribe(result => {
      if (result != null && result["publisher-relevance"] != null && result["publisher-relevance"] == this.article.category.id) {
        this.publisherUserRelevance = this.userProfile.getPublisherRelevance(this.article.category.id, this.article.publisher.id);
        this.changeDetector.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    //this.userProfile.getPublishersRelevance().unsubscribe();
  }

  publisherDialog(publisher: Publisher, category: Category) {
    let dialogRef = this.dialog.open(PublisherDialog, {
      data: { "publisher": publisher, "category": category }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
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
