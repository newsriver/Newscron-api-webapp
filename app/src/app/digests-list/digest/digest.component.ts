import { Component, Input, OnInit, OnChanges, SimpleChanges, HostListener, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule,Router, ActivatedRoute, Params } from '@angular/router';
import { NewscronClientService } from '../../newscron-client.service';
import { Digest, Section, Category, Article } from '../../newscron-model';
import { SectionComponent } from '../../section/section.component';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'digest',
  templateUrl: './digest.component.html',
  styleUrls: ['./digest.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DigestComponent implements OnInit {

  @Input() digest: Digest;


  constructor(private el: ElementRef,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

}
