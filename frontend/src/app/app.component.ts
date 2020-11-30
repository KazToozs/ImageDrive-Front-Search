import { Component } from '@angular/core';
import { SearchDataService } from './services/search-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Image Data';

  constructor(
    private dataService: SearchDataService
  ) { }

}
