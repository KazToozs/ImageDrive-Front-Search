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

  UIMessage: Observable<string>;
  dataSource: SearchResultsDataSource;

  constructor(private dataService: SearchDataService) {
    this.UIMessage = dataService.getUIMessage();
    this.dataSource = new SearchResultsDataSource(dataService);
  }

  ngOnInit(): void {
  }

}

export class SearchResultsDataSource extends DataSource<SearchResult | undefined> {
  private dataStream: BehaviorSubject<(SearchResult | undefined)[]>;
  private scrollSubscription = new Subscription();
  private pageSize = 20;

  @Input() searchField: string;

  constructor(private dataService: SearchDataService) {
    super();
    this.dataStream = new BehaviorSubject<(SearchResult | undefined)[]>([]);
    this._fetchResultPage();
  }

  connect(collectionViewer: CollectionViewer): Observable<(SearchResult | undefined)[] | ReadonlyArray<SearchResult | undefined>> {
    this.scrollSubscription.add(collectionViewer.viewChange.subscribe(range => {
      const currentPage = this._getPageForIndex(range.end);
      // TODO delete these
      console.log('end: ' + range.end);
      console.log(currentPage);
      if (currentPage > this.dataService.getLastPageNumber()) {
        this.dataService.setLastPageNumber(currentPage);
        this.dataService.setPageNumber(currentPage);
        this._fetchResultPage();
      }
    }));
    return this.dataStream;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.scrollSubscription.unsubscribe();
  }


  private _fetchResultPage(): void {
    this.dataService.getSearchResults();
    this.dataService.searchResults.subscribe(results => {
          this.dataStream.next(results);
      });
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }
}
