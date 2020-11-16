import { SearchResult } from '../searchResult';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  searchOptions = [];
  pageNumber = 0;
  public searchResults: SearchResult[];
  // TODO set this to .env file?
  PAGE_PARAM: string;
  FIELD_PARAM: string; // TODO set this to the searchOptions filter
  SEARCH_URL: string;
  //TODO delete this
  constructor(private http: HttpClient) {
    this.updateSearchUrl()
   }

   updateSearchUrl() {
    this.PAGE_PARAM = 'page=' + this.pageNumber;
    this.FIELD_PARAM = 'field=' + 'description'; // TODO set this to the searchOptions filter
    this.SEARCH_URL = 'http://localhost:8080/search/?' + this.PAGE_PARAM + "&" + this.FIELD_PARAM;
   }

  getSearchResults() {
    this.updateSearchUrl()
    console.log(this.SEARCH_URL)
    return this.http.get<SearchResult[]>(this.SEARCH_URL);
  }

  filteredListOptions() {
    const results = this.searchResults;
    const filteredResultsList = [];
    for (const result of results) {
      for (const options of this.searchOptions) {
        if (options.description === result.description) {
          filteredResultsList.push(result);
        }
      }
    }
    console.log(filteredResultsList);
    return filteredResultsList;
  }
}
