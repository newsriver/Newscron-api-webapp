import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Publisher } from './newscron-model';
import { LoggerService } from './logger.service';


@Injectable()
export class UserProfileService {

  private profileUpdate: BehaviorSubject<{ [id: string]: any; }> = new BehaviorSubject<{ [id: string]: any; }>(null);
  private publishersRelevance: { [id: number]: { [id: number]: Publisher; }; } = {};
  private readability: { [id: string]: any; } = {};


  constructor(private logger: LoggerService) {
    this.publishersRelevance = JSON.parse(localStorage.getItem('publishers-relevance'));
    if (this.publishersRelevance == null) {
      this.publishersRelevance = {};
    }
    this.readability = JSON.parse(localStorage.getItem('readability'));
    if (this.readability == null) {
      this.readability = { "general": false };
    }
  }

  public getGeneralReadability() {
    return this.readability.general;
  }

  public setGeneralReadability(readability: boolean) {
    this.readability.general = readability;
    localStorage.setItem('readability', JSON.stringify(this.readability));
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
    //remove if relevance is 0
    if (relevance == 0) {
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
    this.logger.logPublisherRelevance(categoryId, publisher.id, relevance);
  }

}
