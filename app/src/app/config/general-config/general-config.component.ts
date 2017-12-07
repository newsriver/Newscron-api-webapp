import { Component, OnInit } from '@angular/core';
import { NewscronClientService, CategoryPreference } from '../../newscron-client.service';

@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.css']
})
export class GeneralConfigComponent implements OnInit {

  public categories: CategoryPreference[] = [];
  constructor(private client: NewscronClientService) { }

  ngOnInit() {
    this.categories = this.client.getUserPreferences().categories;
  }

}
