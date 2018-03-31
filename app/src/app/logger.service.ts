import { Inject, Injectable } from '@angular/core';
import { Log, LogEntry, PublisherRelevanceLogEntry } from './newscron-model';
import { NewscronClientService, BootstrapConfiguration, CategoryPreference } from './newscron-client.service';
import { environment } from '../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class LoggerService {

  private baseURL: string = environment.serviceURL + "/v3";
  private uuid: string = null;

  constructor( @Inject(Http) private http: Http) {
    this.uuid = localStorage.getItem('uuid');
    if (this.uuid == null) {
      this.uuid = this.uuidGenerator();
      localStorage.setItem('uuid', this.uuid);
    }
  }


  public logPublisherRelevance(categoryId: number, publisherId: number, relevance: number) {
    let entries: LogEntry[] = [];
    entries.push(new PublisherRelevanceLogEntry(categoryId, publisherId, relevance));
    this.logEvents(entries);
  }

  private logEvents(entries: LogEntry[]) {
    let log: Log = new Log();
    log.logs = entries;
    log.version = environment.version;
    log.uuid = this.uuid;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/log", log, options).subscribe(data => { });
  }

  public getUUID(): string {
    return this.uuid;
  }

  private uuidGenerator(): string {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

}
