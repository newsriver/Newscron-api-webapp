import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Publisher } from './newscron-model';
@Injectable()
export class UserProfileService {

  private profileUpdate: BehaviorSubject<{ [id: string]: any; }> = new BehaviorSubject<{ [id: string]: any; }>(null);
  private publishersRelevance: { [id: number]: { [id: number]: Publisher; }; } = {};
  constructor() {
    this.publishersRelevance = JSON.parse(localStorage.getItem('publishers-relevance'));
    if (this.publishersRelevance == null) {
      this.publishersRelevance = {};
    }
  }

  public getProfileUpdateObserver(): Observable<{ [id: string]: any; }> {
    return this.profileUpdate.asObservable();
  }

  public getPublisherRelevance(categoryId: number, publisherId: number): number {
    if (this.publishersRelevance[categoryId] == null) {
      return 0;
    }
    if (this.publishersRelevance[categoryId][publisherId] == null) {
      return 0;
    }
    return this.publishersRelevance[categoryId][publisherId].relevance;
  }

  public getRemovedPublishersForCategory(categoryId: number): { [id: number]: Publisher; } {
    if (this.publishersRelevance[categoryId] == null) {
      return {};
    }
    let publishers: { [id: number]: Publisher; } = {};
    for (var id in this.publishersRelevance[categoryId]) {
      if (this.publishersRelevance[categoryId][id].relevance <= -100)
        publishers[id] = this.publishersRelevance[categoryId][id];
    }
    return publishers;
  }


  public setPublishersRelevance(categoryId: number, publisher: Publisher, relevance: number) {
    //remove if relevance is null
    if (relevance == null) {
      if (this.publishersRelevance[categoryId] != null && this.publishersRelevance[categoryId][publisher.id] != null) {
        delete this.publishersRelevance[categoryId][publisher.id];
      }
    } else {
      if (this.publishersRelevance[categoryId] == null) {
        this.publishersRelevance[categoryId] = {};
      }
      if (this.publishersRelevance[categoryId][publisher.id] == null) {
        this.publishersRelevance[categoryId][publisher.id] = new Publisher();
        this.publishersRelevance[categoryId][publisher.id].name = publisher.name;
        this.publishersRelevance[categoryId][publisher.id].id = publisher.id;
      }
      this.publishersRelevance[categoryId][publisher.id].relevance = relevance;
    }
    localStorage.setItem('publishers-relevance', JSON.stringify(this.publishersRelevance));
    this.profileUpdate.next({ "publisher-relevance": categoryId });
  }

}
