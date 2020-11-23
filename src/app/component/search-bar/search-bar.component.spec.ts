import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchDataService } from 'src/app/services/search-data.service';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let service: SearchDataService;
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SearchBarComponent ],
      providers: [ SearchDataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(SearchDataService);
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default params', () => {
    expect(component).toBeTruthy();
    expect(component.debounceTime).toBeTruthy();
    expect(component.descriptionSearch).toBeDefined('');
    expect(component.fileTypeFilter).toBe('any');
    expect(component.minSize).toBe(0);
    expect(component.maxSize).toBe(500000);
  });

  describe('checkSizeChange function', () => {
    it('should set validationError to true if values are incorrect', () => {
      component.minSize = 500;
      component.maxSize = 250;
      component.checkSizeChange();
      expect(component.validationError).toBeTrue();
    });

    it('(fakeAsync usage) should change search parameter values in component and searchDataService if values correct', fakeAsync(() => {
      component.minSize = 100;
      component.maxSize = 250;
      component.fileTypeFilter = 'any';
      component.descriptionSearch = 'test';
      component.checkSizeChange();

      tick(750);
      expect(component.validationError).toBeFalse();
      service.pageNumber.subscribe((val) => expect(val).toBe(0));
      expect(service.getLastPageNumber()).toBe(0);
      expect(service.descriptionFilter).toBe(component.descriptionSearch);
      expect(service.fileSizeMax).toBe(component.maxSize);
      expect(service.fileSizeMin).toBe(component.minSize);
      expect(service.fileType).toBe(component.fileTypeFilter);
    })
    );
  });

  describe('handleChange function', () => {
    it('should give the searchDataService it\'s search parameter values', () => {
      component.descriptionSearch = 'test';

      component.handleChange();
    });
  });
});
