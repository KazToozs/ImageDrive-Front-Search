import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchDataService } from './search-data.service';

describe('SearchDataService', () => {
  let service: SearchDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SearchDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resetList function', () => {
    it('should reset page number and clear the list', () => {
      service.resetList();
      expect(service.getLastPageNumber()).toBe(0);
      service.pageNumber.subscribe((val) => {expect(val).toBe(0); });
      service.searchResults.subscribe((val) => {expect(val).toEqual([]); });
    });
  });

  it('should have a function setter for pageNumbe', () => {
    service.setPageNumber(0);
    service.setLastPageNumber(0);

    service.pageNumber.subscribe((val) => expect(val).toBe(0));
  });

  it('should have a function setter for lastPageNumber', () => {
    service.setLastPageNumber(0);

    service.lastPageNumber.subscribe((val) => expect(val).toBe(0));
  });

});
