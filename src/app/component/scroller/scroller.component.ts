import { Component, Input, OnInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { SearchResult } from 'src/app/searchResult';
import { SearchDataService } from 'src/app/services/search-data.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.scss']
})
export class ScrollerComponent implements OnInit {

  dataSource: SearchResultsDataSource;

  constructor(private dataService: SearchDataService) {
    this.dataSource = new SearchResultsDataSource(dataService);
  }

  ngOnInit(): void {
  }

}

export class SearchResultsDataSource extends DataSource<SearchResult | undefined> {
  private cachedResults = Array.from<SearchResult>({ length: 0 });
  // private dataStream = new BehaviorSubject<(SearchResult | undefined)[]>(this.cachedResults);
  private dataStream: BehaviorSubject<(SearchResult | undefined)[]>;
  private listSubscription = new Subscription();
  private scrollSubscription = new Subscription();
  private pageSize = 20;
  private lastPage = 0;

  @Input() searchField: string;

  constructor(private dataService: SearchDataService) {
    super();
    this.listSubscription = this.dataService.searchResults
       .subscribe(results => this.cachedResults = results)
    this.dataStream = new BehaviorSubject<(SearchResult | undefined)[]>(this.cachedResults);
    this._fetchResultPage();
  }

  connect(collectionViewer: CollectionViewer): Observable<(SearchResult | undefined)[] | ReadonlyArray<SearchResult | undefined>> {
    this.scrollSubscription.add(collectionViewer.viewChange.subscribe(range => {
      const currentPage = this._getPageForIndex(range.end);
      // TODO delete these
      console.log('end: ' + range.end)
      console.log(currentPage)
      if (currentPage > this.lastPage) {
        this.lastPage = currentPage;
        this.dataService.pageNumber = this.lastPage;
        this._fetchResultPage();
      }
    }));
    return this.dataStream;
  }

  _filterResults(val) {
    if (typeof val != "string") {
        return [];
    }
    if (val === '' || val === null) {
        return [];
    }
    let ret = val ? this.cachedResults.filter(s => s.description.toLowerCase().indexOf(val.toLowerCase()) !== -1)
        : this.cachedResults;
}

  disconnect(collectionViewer: CollectionViewer): void {
    this.scrollSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }


  private _fetchResultPage(): void {
    this.dataService.getSearchResults();
    this.dataService.searchResults.subscribe(results => {
        this.cachedResults = this.cachedResults.concat(results);
        this.dataStream.next(this.cachedResults)
      })

      // this.dataService.getSearchResults().subscribe(res => {
      //   let convertedResults: SearchResult[] = [];
      //   res.forEach((item) => {
      //     convertedResults.push(item['_source'])
      //   })
      //   this.cachedResults = this.cachedResults.concat(convertedResults);
      //   // this._filterResults(this.dataService.descriptionFilter);
      //   this.dataStream.next(this.cachedResults);
      // });
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }
}
