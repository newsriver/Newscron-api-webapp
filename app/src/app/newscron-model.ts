
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
  public title: string = null;
  public url: string = null;
  public snippet: string = null;
  public imgUrl: string = null;
  public publicationDate: number = null;
  public publisher: Publisher = null;
  public category: Category = null;
  public score: number = null;
}
