import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Section, Category, Article, Publisher } from '../../newscron-client.service';
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
  constructor(private userProfile: UserProfileService, public dialog: MatDialog, private chageDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.userProfile.getPublishersRelevance().subscribe(result => {
      if (result != null && result[this.article.category.id] != null && result[this.article.category.id][this.article.publisher.id] != null) {
        this.publisherUserRelevance = result[this.article.category.id][this.article.publisher.id];
        this.chageDetector.detectChanges();
      }
    });
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

  public removeall: boolean = false;
  relevance: string;

  constructor(public dialogRef: MatDialogRef<PublisherDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private userProfile: UserProfileService) {

  }

  save(relevance: number) {
    this.userProfile.setPublishersRelevance(this.data.category.id, this.data.publisher.id, relevance);
    this.dialogRef.close('close');
  }
}
