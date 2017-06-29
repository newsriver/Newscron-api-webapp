import { Component, OnInit, Input, Inject } from '@angular/core';
import {Section, Category, Article, Publisher} from '../newscron-client.service';
import { CordovaService } from '../cordova.service';
import { Router, ActivatedRoute} from '@angular/router';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {NewscronClientService} from '../newscron-client.service';
import {Pipe, PipeTransform} from '@angular/core';


@Pipe({ name: 'escapeHtml', pure: false })
export class EscapeHtmlPipe implements PipeTransform {
  transform(value: string, args: any[] = []) {
    if (value == null) return "";
    return value.replace(new RegExp("<highlighted>", 'g'), "<span>").replace(new RegExp("</highlighted>", 'g'), "</span>")
  }
}

@Component({
  selector: 'articles',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  public isDigest = true;

  @Input() article: Article;
  constructor(public cordovaService: CordovaService, private route: ActivatedRoute, public dialog: MdDialog) {

    if (route.snapshot.url[0] != null && route.snapshot.url[0].path != null && route.snapshot.url[0].path === "top") {
      this.isDigest = false;
    }

  }


  ngOnInit() {
  }




  public openLinkInBrowser() {
    this.cordovaService.openLinkInBrowser(this.article.url);
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
  constructor(public dialogRef: MdDialogRef<PublisherDialog>, @Inject(MD_DIALOG_DATA) public data: any, private client: NewscronClientService) {

  }

  save() {
    this.client.publishersOptOut(this.data.publisher, this.data.category);
    this.dialogRef.close('close');
  }
}
