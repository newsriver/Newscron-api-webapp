
export class Publisher {
  public name: string;
  public id: number;
  public relevance: number;
}
export class Category {
  public name: string = null;
  public id: number;
}
export class Section {
  public category: Category = null;
  public articles: Article[];
}

export class Digest {
  public timestamp: number = null;
  public sections: Section[];
}


export class Article {
  public id: number = null;
  public topicId: number = null;
  public title: string = null;
  public url: string = null;
  public snippet: string = null;
  public imgUrl: string = null;
  public publicationDate: number = null;
  public publisher: Publisher = null;
  public category: Category = null;
  public score: number = null;
}

export class Log {
  public logs: LogEntry[] = null;
  public uuid: string = null;
  public version: string = null;
}

export abstract class LogEntry {
  public timestamp: number;
  constructor() {
    this.timestamp = Date.now();
  }
}

export class PublisherRelevanceLogEntry extends LogEntry {
  public type: string = "pubRelevance"; //used by java to deserialize

  constructor(public categoryId: number, public publisherId: number, public relevance: number) {
    super();
  }
}
