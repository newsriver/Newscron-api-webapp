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
    this.categoryId = this.route.snapshot.params['id'];
    this.name = this.route.snapshot.params['name'];

    this.loading = true;
    this.section = null;
    this.client.category(this.categoryId).subscribe(section => {
      this.section = section;
      this.loading = false;
    });



  }
}
