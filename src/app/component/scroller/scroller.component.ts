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
  private dataStream = new BehaviorSubject<(SearchResult | undefined)[]>(this.cachedResults);
  private subscription = new Subscription();
  private pageSize = 20;
  private lastPage = 0;

  @Input() searchField: string;

  constructor(private dataService: SearchDataService) {
    super();
    this._fetchResultPage();

  }

  connect(collectionViewer: CollectionViewer): Observable<(SearchResult | undefined)[] | ReadonlyArray<SearchResult | undefined>> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const currentPage = this._getPageForIndex(range.end);
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

  disconnect(collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }


  private _fetchResultPage(): void {
      this.dataService.getSearchResults().subscribe(res => {
        let convertedResults: SearchResult[] = [];
        res.forEach((item) => {
          convertedResults.push(item['_source'])
        })
        this.cachedResults = this.cachedResults.concat(convertedResults);
        this.dataStream.next(this.cachedResults);
      });
  }

  private _getPageForIndex(i: number): number {
    return Math.floor(i / this.pageSize);
  }
}
