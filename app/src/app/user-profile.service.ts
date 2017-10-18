import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserProfileService {

  private publishersRelevance2: BehaviorSubject<{ [id: number]: { [id: number]: number; }; }> = new BehaviorSubject<{ [id: number]: { [id: number]: number; }; }>(null);


  private publishersRelevance: { [id: number]: { [id: number]: number; }; } = {};
  constructor() {
    this.publishersRelevance = JSON.parse(localStorage.getItem('publishers-relevance'));
    if (this.publishersRelevance == null) {
      this.publishersRelevance = {};
    }
    this.publishersRelevance2.next(this.publishersRelevance);
  }

  public getPublishersRelevance(): Observable<{ [id: number]: { [id: number]: number; }; }> {
    return this.publishersRelevance2.asObservable();
  }

  public getPublisherRelevance(categoryId: number, publisherId: number): number {
    if (this.publishersRelevance[categoryId] == null) {
      return 0;
    }
    if (this.publishersRelevance[categoryId][publisherId] == null) {
      return 0;
    }
    return this.publishersRelevance[categoryId][publisherId];
  }

  public setPublishersRelevance(categoryId: number, publisherId: number, relevance: number) {
    if (this.publishersRelevance[categoryId] == null) {
      this.publishersRelevance[categoryId] = {};
    }
    this.publishersRelevance[categoryId][publisherId] = relevance;
    localStorage.setItem('publishers-relevance', JSON.stringify(this.publishersRelevance));
    this.publishersRelevance2.next(this.publishersRelevance);
  }

}



export class Publisher {
  public name: string;
  public id: number;
}
