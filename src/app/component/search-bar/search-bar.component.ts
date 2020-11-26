import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SearchDataService } from 'src/app/services/search-data.service';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 750;
  descriptionSearch = '';
  minSize = 0;
  maxSize = 500000;
  fileTypeFilter = 'any';

  validationError: boolean;

  constructor(
    private dataService: SearchDataService
  ) { }

  ngOnInit(): void {
    this.subscription = this.modelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe(() => {
        this.handleChange();
      });
  }

  handleChange() {
    this.dataService.descriptionFilter = this.descriptionSearch;
    this.dataService.fileSizeMax = this.maxSize;
    this.dataService.fileSizeMin = this.minSize;
    this.dataService.fileType = this.fileTypeFilter;
    this.dataService.resetList();
    this.dataService.getSearchResults();
  }

  validateSearch() {
    if (this.minSize > this.maxSize) {
      // TODO make UI service error or form validation error
      this.validationError = true;
      return;
    }
    else {
      this.validationError = false;
      this.modelChanged.next();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
