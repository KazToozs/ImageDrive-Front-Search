import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScrollerComponent, SearchResultsDataSource } from './scroller.component';
import { SearchDataService } from 'src/app/services/search-data.service';
import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
describe('ScrollerComponent', () => {
  let component: ScrollerComponent;
  let fixture: ComponentFixture<ScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ScrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

describe('SearchResultsDataSource', () => {
  let dataSource: SearchResultsDataSource;
  let service: SearchDataService;
  let collectionViewer: CollectionViewer;
  let listRangeSubject: BehaviorSubject<ListRange>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchDataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(SearchDataService);
    dataSource = new SearchResultsDataSource(service);
    listRangeSubject = new BehaviorSubject({start: 0, end: 0});
    collectionViewer = { viewChange: listRangeSubject.asObservable() }
  });

  it('should provide a DataSource', () => {
    expect(dataSource.connect(collectionViewer)).toBeTruthy();
  });

  it('should change dataService page numbers upon reaching 20 elements on page', () => {
    dataSource.connect(collectionViewer);
    listRangeSubject.next({start: 0, end: 21});

    expect(service.getLastPageNumber()).toBe(1);
  });
});
