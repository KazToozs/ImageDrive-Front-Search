import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SearchResult } from '../searchResult';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  private searchResultsSubject: BehaviorSubject<SearchResult[]> = new BehaviorSubject([]);
  private pageNumberSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private lastPageNumberSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private UIMessageSubject: BehaviorSubject<string> = new BehaviorSubject('Data service injected...');

  public readonly searchResults: Observable<SearchResult[]> = this.searchResultsSubject.asObservable();
  public readonly pageNumber: Observable<number> = this.pageNumberSubject.asObservable();
  public readonly lastPageNumber: Observable<number> = this.lastPageNumberSubject.asObservable();
  public readonly UIMessage: Observable<string> = this.UIMessageSubject.asObservable();

  // Make these private with getters/setters, observables?
  descriptionFilter = '';
  fileType = 'any';
  fileSizeMin = 0;
  fileSizeMax = 500000;

  constructor(private http: HttpClient) {
  }

  resetList() {
    this.pageNumberSubject.next(0);
    this.lastPageNumberSubject.next(0);
    this.searchResultsSubject.next([]);
  }

  private constructSearchURL(): string {
    const url = `http://${environment.apiUrl}:${environment.apiPort}/search/?`;
    const params = new URLSearchParams();

    params.append('p', this.pageNumberSubject.getValue().toString());
    params.append('mn', this.fileSizeMin.toString());
    params.append('mx', this.fileSizeMax.toString());
    if (this.descriptionFilter) {
      console.log('constructing description param:' + this.descriptionFilter);
      params.append('d', encodeURIComponent(this.descriptionFilter));
    }
    if (this.fileType !== 'any') {
      params.append('t', encodeURIComponent(this.fileType));
    }

    return url + params.toString();
  }

  getSearchResults() {
    // TODO put these in .env file?
    const url = this.constructSearchURL();
    console.log(url);
    this.setUIMessage('Searching, please wait...');
    const obs = this.http.get<SearchResult[]>(url, {observe: 'response'});
    // TODO handle 500 error here
    obs.subscribe(
      res => {
        const convertedResults: SearchResult[] = [];
        if (res.status === 204) {
          // TODO UI service for no results
          this.setUIMessage('No results returned!');
          console.log('EMPTY RESULTS');
        } else if (res.status === 200) {
          this.setUIMessage('Search results received!');
          res.body.forEach((item) => {
            convertedResults.push(item[`_source`]);
          });
        }
        console.log(convertedResults);
        this.searchResultsSubject.next(this.searchResultsSubject.getValue().concat(convertedResults));
      },
      err => {
        this.setUIMessage(`An error occured with the search query: ${err.status}: ${err.error}`);
        console.log(err);
      }
    );
  }

  setPageNumber(num: number) {
    this.pageNumberSubject.next(num);
  }

  setLastPageNumber(num: number) {
    this.lastPageNumberSubject.next(num);
  }

  getLastPageNumber(): number {
    return this.lastPageNumberSubject.getValue();
  }

  getUIMessage(): Observable<string> {
    return this.UIMessage;
  }

  setUIMessage(str: string) {
    this.UIMessageSubject.next(str);
  }

}
