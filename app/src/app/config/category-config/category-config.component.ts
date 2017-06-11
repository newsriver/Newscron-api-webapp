import { Component, OnInit } from '@angular/core';
import {NewscronClientService, BootstrapConfiguration, CategoryPreference, UserPreferences} from '../../newscron-client.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-category-config',
  templateUrl: './category-config.component.html',
  styleUrls: ['./category-config.component.css']
})
export class CategoryConfigComponent implements OnInit {

  public category: CategoryPreference = null;


  constructor(private client: NewscronClientService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    let categoryId: number = this.route.snapshot.params['id'];
    this.category = this.client.getUserPreferences().getCategory(categoryId);
  }

}



export class Continent {
  public title: string = null;
  public id: string = null;
  public size: number = null;

}
