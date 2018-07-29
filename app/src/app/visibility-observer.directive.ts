import { Directive, Input, Output, EventEmitter, ElementRef, HostBinding, HostListener } from '@angular/core';

function _window(): any {
  // return the global native browser window object
  return window;
}


@Directive({
  selector: '[visibility-observer]'
})
export class VisibilityObserverDirective {



  @Input('visibility-observer')
  private callbackFunction: Function;

  constructor(private element: ElementRef) {

  }

  public ngAfterViewInit() {
    new VisibilityObserver(this.element.nativeElement, this.isVisible);
  }


  public isVisible = (): void => {
    this.callbackFunction && this.callbackFunction();
  }

}


export class VisibilityObserver {

  private callback: any;
  private observer: any;



  constructor(private _element: ElementRef, callback) {
    this.callback = callback;
    if (_window().IntersectionObserver) {
      this.observer = new IntersectionObserver(this.processChanges, { threshold: 0.5 });
      this.observer.observe(_element);
    }
  }


  private processChanges = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry: any) => {
      var element: any = entry.target;

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        this.callback && this.callback();
        this.observer.unobserve(element);
        this.observer.disconnect();

      }
    });
  }

}
