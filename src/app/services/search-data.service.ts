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
  pageNumber: number = 0;
  descriptionFilter: string = '';
  fileType = 'PNG';
  public readonly searchResults: Observable<SearchResult[]> = this._searchResults.asObservable();

  constructor(private http: HttpClient) {
    // load initial data
  }

  resetList() {
    this._searchResults.next([]);
  }

  getSearchResults(): Observable<SearchResult[]> {
    // TODO put these in .env file?
    let PAGE_PARAM = 'p=' + this.pageNumber;
    let FIELD_PARAM = 'd=' + this.descriptionFilter;
    let TYPE_PARAM = 't=' + this.fileType;
    let SEARCH_URL = 'http://localhost:8080/search/?' + PAGE_PARAM + "&" + FIELD_PARAM + "&" + TYPE_PARAM;    console.log(SEARCH_URL)

    let obs = this.http.get<SearchResult[]>(SEARCH_URL);
    obs.subscribe(
      res => {
        let convertedResults: SearchResult[] = [];
        res.forEach((item) => {
          convertedResults.push(item['_source']);
        })

        console.log('Received results');
        console.log(convertedResults);
        this._searchResults.next(convertedResults);
      }
    )
    return (obs);
  }

}
