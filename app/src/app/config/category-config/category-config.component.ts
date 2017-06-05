import { Component, OnInit } from '@angular/core';
import {NewscronClientService, BootstrapConfiguration, CategoryPreference, UserPreferences} from '../../newscron-client.service';

@Component({
  selector: 'app-category-config',
  templateUrl: './category-config.component.html',
  styleUrls: ['./category-config.component.css']
})
export class CategoryConfigComponent implements OnInit {



  constructor(private client: NewscronClientService) { }

  ngOnInit() {
  }

}



export class Continent {
  public title: string = null;
  public id: string = null;
  public size: number = null;

}
