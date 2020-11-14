import { Component, OnInit } from '@angular/core';
import { SearchResult } from 'src/app/searchResult';
import { SearchDataService } from 'src/app/services/search-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  results: SearchResult[]
  constructor(
    private dataService: SearchDataService
  ) { }

  ngOnInit() {
    this.dataService.getSearchResults().subscribe(results => {
      this.results = results;
      this.dataService.searchResults = results;
    });
  }

  onSelectedFilter(e) {
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.dataService.searchOption.length > 0) {
      this.results = this.dataService.filteredListOptions();
    }
    else {
      this.results = this.dataService.searchResults;
    }

  }

}
