import { Component, OnInit } from '@angular/core';
import { SearchResult } from 'src/app/searchResult';
import { SearchDataService } from 'src/app/services/search-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  results: SearchResult[];
  constructor(
    private dataService: SearchDataService
  ) { }

  ngOnInit() {
  }

  onSelectedFilter(e) {
    this.getFilteredList();
  }

  getFilteredList() {
    if (this.dataService.searchOptions.length > 0) {
      this.results = this.dataService.filteredListOptions();
    }
    else {
      this.results = this.dataService.searchResults;
    }

  }

}
