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
  public currentSectionName: string = null;
  public positions: any[] = [];
  public headerWidth: number = 600;
  public padding: number = 50;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.headerWidth = this.el.nativeElement.getBoundingClientRect().width + 1;
  }

  sectionPosition($event) {
    this.positions = this.positions.filter(item => item.name != $event.name);
    this.positions.push($event);
    this.positions.sort((a: any, b: any) => {
      return b.position - a.position;
    });

    //if the page has already been scrolled find the current name
    if (document.body.scrollTop > 0) {
      this.currentSectionName = this.getCurrentSectionName();
    }
  }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.currentSectionName = this.getCurrentSectionName();
  }

  private getCurrentSectionName(): string {

    let offset: number = this.el.nativeElement.parentElement.offsetTop - this.el.nativeElement.offsetTop - this.padding;

    for (let section of this.positions) {
      if ((section.position + offset - document.body.scrollTop) < 0) {
        return section.name;
      }
    }
    return null;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.headerWidth = this.el.nativeElement.getBoundingClientRect().width + 1;
  }

}
