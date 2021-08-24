import {   NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { AppComponent } from './components/app.component';
import { DataService } from './services/data.service';

@NgModule({
    imports: [ WjGridModule, BrowserModule],
    declarations: [AppComponent],
    providers:[DataService],
    bootstrap: [AppComponent],
})

export class AppModule { }