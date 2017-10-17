import { Injectable } from '@angular/core';

@Injectable()
export class UserProfileService {

  private publishersRelevance: { [id: number]: { [id: number]: number; }; } = {};
  constructor() {
    this.publishersRelevance = JSON.parse(localStorage.getItem('publishers-relevance'));
    if (this.publishersRelevance == null) {
      this.publishersRelevance = {};
    }
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
  }

}



export class Publisher {
  public name: string;
  public id: number;
}
