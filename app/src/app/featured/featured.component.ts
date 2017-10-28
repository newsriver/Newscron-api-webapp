import { NgModule, Component, OnInit, Input, OnChanges, SimpleChanges, HostListener, ElementRef } from '@angular/core';
import { SectionComponent } from '../section/section.component';
import { NewscronClientService } from '../newscron-client.service';
import { Section, Category, Article } from '../newscron-model';

@Component({
  selector: 'featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit {


  public sections: Section[] = [];
  public loading: boolean = true;
  public currentSectionName: string = null;
  public positions: any[] = [];
  public headerWidth: number = 600;
  public padding: number = 50;


  constructor(private client: NewscronClientService, private el: ElementRef) { }

  ngOnInit() {
    this.headerWidth = this.el.nativeElement.getBoundingClientRect().width + 1;
    this.client.refreshListener().subscribe(refresh => {
      if (refresh) {
        this.sections = [];
        this.positions = [];
        this.loading = true;
        this.client.featured().subscribe(sections => {
          this.sections = sections;
          this.loading = false;
        });
      }
    });
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
