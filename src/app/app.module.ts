import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/blocks/header/header.component';
import { BucketListComponent } from './components/bucket-list/bucket-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BucketDetailsComponent } from './components/bucket-details/bucket-details.component';
import { FileSizePipe } from './common/pipes/file-size.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BucketListComponent,
    BucketDetailsComponent,
    FileSizePipe
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
