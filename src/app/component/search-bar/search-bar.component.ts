import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SearchDataService } from 'src/app/services/search-data.service';
import { SearchResult } from '../../searchResult';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

    myControl = new FormControl();
    filteredOptions: Observable<string[]>;
    allResults: SearchResult[];
    autoCompleteList: any[]

    @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
    @Output() selectedOption = new EventEmitter();

    constructor(
        public dataService: SearchDataService
    ) { }

    ngOnInit() {

        // get all the post
        this.dataService.getSearchResults().subscribe(res => {
          console.log(res)
          let convertedResults: SearchResult[] = [];
          res.forEach((item) => {
            convertedResults.push(item['_source'])
          })
            this.allResults = convertedResults;

        });

        // when user types something in input, the value changes will come through this
        this.myControl.valueChanges.subscribe(userInput => {
            this.autoCompleteExpenseList(userInput);
        })
    }

    private autoCompleteExpenseList(input) {
        let categoryList = this.filterCategoryList(input)
        this.autoCompleteList = categoryList;
    }

    // this is where filtering the data happens according to you typed value
    filterCategoryList(val) {
        let categoryList = []
        if (typeof val != "string") {
            return [];
        }
        if (val === '' || val === null) {
            return [];
        }
        return val ? this.allResults.filter(s => s.description.toLowerCase().indexOf(val.toLowerCase()) !== -1)
            : this.allResults;
    }

    // after you clicked an autosuggest option, this function will show the field you want to show in input
    displayFn(post: SearchResult) {
        let k = post ? post.description : post;
        return k;
    }

    filterResultList(event) {
        let result = event.source.value;
        if (!result) {
            this.dataService.searchOptions = []
        }
        else {

            this.dataService.searchOptions.push(result);
            this.selectedOption.emit(this.dataService.searchOptions)
        }
        this.focusOnPlaceInput();
    }

    removeOption(option) {

        const index = this.dataService.searchOptions.indexOf(option);
        if (index >= 0) {
          this.dataService.searchOptions.splice(index, 1);
        }
        this.focusOnPlaceInput();

        this.selectedOption.emit(this.dataService.searchOptions)
    }

    // focus the input field and remove any unwanted text.
    focusOnPlaceInput() {
        this.autocompleteInput.nativeElement.focus();
        this.autocompleteInput.nativeElement.value = '';
    }


}
