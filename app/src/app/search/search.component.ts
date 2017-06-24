import { NgModule, Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {NewscronClientService, Section, Category, Article} from '../newscron-client.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchPhrase: string;
  public section: Section;
  public loading: boolean = true;
  public language: string = "";
  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {

    //we need to subscribe to the params changes as the router is not reloading the componet on param changes
    this.route.params.subscribe(params => {

      this.searchPhrase = params.searchPhrase;
      this.language = params.language;


      this.searchArticles();

    });
  }

  public search(e) {
    if (e) {
      e.preventDefault();
    }
    this.router.navigate(['/search', this.language, this.searchPhrase]);
  }

  public searchArticles() {
    this.loading = true;
    this.section = null;

    let query: string = "text:\"" + this.searchPhrase + "\"~50";
    if (this.language.length > 0) {
      query += " AND language:" + this.language;
    }
    this.client.search(query).subscribe(section => {
      this.section = section;
      this.loading = false;
    });
  }

}
