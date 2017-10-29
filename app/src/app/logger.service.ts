import { Inject, Injectable } from '@angular/core';
import { Log, LogEntry, PublisherRelevanceLogEntry } from './newscron-model';
import { NewscronClientService, BootstrapConfiguration, CategoryPreference } from './newscron-client.service';
import { environment } from '../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class LoggerService {

  private baseURL: string = "http://localhost:9092/v3";

  constructor( @Inject(Http) private http: Http) {

  }


  public logPublisherRelevance(categoryId: number, publisherId: number, relevance: number) {
    console.log("pub relevance");
    let entries: LogEntry[] = [];
    entries.push(new PublisherRelevanceLogEntry(categoryId, publisherId, relevance));
    this.logEvents(entries);
  }

  private logEvents(entries: LogEntry[]) {
    let log: Log = new Log();
    log.logs = entries;
    log.version = environment.version;
    //log.uuid = this.client.getUUID();

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseURL + "/log", log, options).subscribe(data => { });
  }


}
