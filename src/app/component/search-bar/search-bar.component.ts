import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { SearchDataService } from 'src/app/services/search-data.service';
import { SearchResult } from '../../searchResult';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 1000;

  constructor(
    public dataService: SearchDataService
  ) { }

  ngOnInit(): void {
    this.subscription = this.modelChanged
      .pipe(
        debounceTime(this.debounceTime),
      )
      .subscribe((val) => {
        this.handleChange(val);
      });
  }

  handleChange(val) {
    this.dataService.descriptionFilter = val;
    this.dataService.resetList();
    this.dataService.getSearchResults();
  }


  inputChanged(val) {
    this.modelChanged.next(val)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
