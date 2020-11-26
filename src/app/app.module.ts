import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';

import { SearchBarComponent } from './component/search-bar/search-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchDataService } from './services/search-data.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollerComponent } from './component/scroller/scroller.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    ScrollerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule, MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    ScrollingModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatButtonModule
  ],
  providers: [
    SearchDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
