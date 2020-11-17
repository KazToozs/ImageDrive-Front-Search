import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SearchDataService } from 'src/app/services/search-data.service';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 750;
  descriptionSearch = '';
  minSize = 0;
  maxSize = 500000;
  fileTypeFilter = "any";

  constructor(
    public dataService: SearchDataService
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
    console.log("Search settings")
    console.log(this.descriptionSearch);
    console.log(this.fileTypeFilter);
    console.log(this.minSize);
    console.log(this.maxSize);
    this.dataService.resetList();
    this.dataService.getSearchResults();
  }

  checkSizeChange() {
    if (this.minSize > this.maxSize) {
      // TODO make UI service error or form validation error
      return;
    }
    else {
      this.inputChanged();
    }
  }

  inputChanged() {
    this.modelChanged.next();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
