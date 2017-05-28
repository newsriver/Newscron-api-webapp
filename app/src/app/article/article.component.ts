import { Component, OnInit, Input, Inject } from '@angular/core';
import {Section, Category, Article} from '../newscron-client.service';
import { CordovaService } from '../cordova.service';
import { Router, ActivatedRoute} from '@angular/router';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'articles',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  public isDigest = false;

  @Input() article: Article;
  constructor(public cordovaService: CordovaService, private route: ActivatedRoute, public dialog: MdDialog) {

    if (route.snapshot.url[0] != null && route.snapshot.url[0].path != null && route.snapshot.url[0].path === "digest") {
      this.isDigest = true;
    }

  }


  ngOnInit() {
  }


  public openLinkInBrowser() {
    this.cordovaService.openLinkInBrowser(this.article.url);
  }

  publisherDialog(publisher: string, category: string) {
    let dialogRef = this.dialog.open(PublisherDialog, {
      data: { "publisher": publisher, "category": category }
    }
    );
    dialogRef.afterClosed().subscribe(result => {
      //this.selectedOption = result;
    });
  }

  categoryDialog(category: string) {
    let dialogRef = this.dialog.open(CategoryDialog, {
      data: { "category": category }
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
  constructor(public dialogRef: MdDialogRef<PublisherDialog>, @Inject(MD_DIALOG_DATA) public data: any) {

  }

  save() {
    this.dialogRef.close('close');
  }
}

@Component({
  selector: 'category-dialog',
  templateUrl: './category-dialog.html',
  styleUrls: ['./dialog.css']
})
export class CategoryDialog {

  public removeall: boolean = false;
  constructor(public dialogRef: MdDialogRef<CategoryDialog>, @Inject(MD_DIALOG_DATA) public data: any) {

  }

  save() {
    this.dialogRef.close('close');
  }
}
