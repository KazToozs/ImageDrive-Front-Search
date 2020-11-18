import { SearchResult } from '../searchResult';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class SearchDataService {
//   private searchResults: Observable<SearchResult[]>;

//   //TODO delete this
//   constructor(private http: HttpClient) {
//    }

//   getSearchResults(pageNumber, description) {
//     // TODO put these in .env file?
//     let PAGE_PARAM = 'page=' + pageNumber;
//     let FIELD_PARAM = 'field=' + 'description';
//     let SEARCH_URL = 'http://localhost:8080/search/?' + PAGE_PARAM + "&" + FIELD_PARAM;    console.log(SEARCH_URL)

//     this.searchResults = this.http.get<SearchResult[]>(SEARCH_URL);
//   }

// }

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  private _searchResults: BehaviorSubject<SearchResult[]> = new BehaviorSubject([]);
  // TODO necessary to set these as behavioursubjects?
  private _pageNumber: BehaviorSubject<number> = new BehaviorSubject(0);
  private _lastPageNumber: BehaviorSubject<number> = new BehaviorSubject(0);

  public readonly searchResults: Observable<SearchResult[]> = this._searchResults.asObservable();
  public readonly pageNumber: Observable<number> = this._pageNumber.asObservable();
  public readonly lastPageNumeber: Observable<number> = this._lastPageNumber.asObservable();

  descriptionFilter = '';
  fileType = 'any';
  fileSizeMin = 0;
  fileSizeMax = 500000;

  constructor(private http: HttpClient) {
    // load initial data
  }

  resetList() {
    this._pageNumber.next(0);
    this._lastPageNumber.next(0);
    this._searchResults.next([]);
  }

  constructSearchURL(): string {
    let url = 'http://localhost:8080/search/?';
    let params = new URLSearchParams();

    params.append('p', this._pageNumber.getValue().toString());
    params.append('mn', this.fileSizeMin.toString());
    params.append('mx', this.fileSizeMax.toString());
    if (this.descriptionFilter) {
      console.log('constructing description param:' + this.descriptionFilter);
      params.append('d', this.descriptionFilter);
    }
    if (this.fileType !== 'any') {
      params.append('t', this.fileType);
    }

    return url + params.toString();
  }

  getSearchResults(): Observable<SearchResult[]> {
    // TODO put these in .env file?
    let url = this.constructSearchURL();
    console.log(url)
    let obs = this.http.get<SearchResult[]>(url);
    // TODO handle 500 error here
    obs.subscribe(
      res => {
        let convertedResults: SearchResult[] = [];
        res.forEach((item) => {
          convertedResults.push(item['_source']);
        })
        console.log('Received results');
        console.log(convertedResults);
        this._searchResults.next(this._searchResults.getValue().concat(convertedResults));
      }
    )
    return (obs);
  }

  setPageNumber(num: number) {
    this._pageNumber.next(num);
  }

  setLastPageNumber(num: number) {
    this._lastPageNumber.next(num);
  }

  getLastPageNumber(): number {
    return this._lastPageNumber.getValue();
  }
}
