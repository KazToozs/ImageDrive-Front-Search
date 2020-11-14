import { SearchResult } from '../searchResult';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  searchOption = [];
  public searchResults: SearchResult[];
  // TODO set this to .env file?
  SEARCH_URL = 'http://localhost:8080/search';

  constructor(private http: HttpClient) { }

  getSearchResults(): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(this.SEARCH_URL);
  }

  filteredListOptions() {
    const results = this.searchResults;
    const filteredResultsList = [];
    for (const result of results) {
      for (const options of this.searchOption) {
        if (options.title === result.description) {
          filteredResultsList.push(result);
        }
      }
    }
    console.log(filteredResultsList);
    return filteredResultsList;
  }
}
