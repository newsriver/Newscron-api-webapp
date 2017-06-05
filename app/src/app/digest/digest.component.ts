import { Component, Input, OnInit, OnChanges, SimpleChanges, HostListener, ElementRef  } from '@angular/core';
import {NewscronClientService, Digest, Section, Category, Article} from '../newscron-client.service';
import {SectionComponent} from '../section/section.component';



@Component({
  selector: 'digest',
  templateUrl: './digest.component.html',
  styleUrls: ['./digest.component.css']
})
export class DigestComponent implements OnInit {

  @Input() digest: Digest;


  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

}
