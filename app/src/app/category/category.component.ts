import { NgModule, Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {NewscronClientService, Section, Category, Article} from '../newscron-client.service';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public categoryId: number;
  public section: Section;
  public name: string;
  public loading: boolean = true;
  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {

    //we need to subscribe to the params changes as the router is not reloading the componet on param changes
    this.route.params.subscribe(params => {

      this.categoryId = params.id;
      this.name = params.name;

      this.loading = true;
      this.section = null;
      this.client.category(this.categoryId).subscribe(section => {
        this.section = section;
        this.loading = false;
      });

    });

  }
}
