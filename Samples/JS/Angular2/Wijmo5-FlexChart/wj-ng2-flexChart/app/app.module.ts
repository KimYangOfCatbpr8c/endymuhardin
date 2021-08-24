import {   NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WjChartModule } from 'wijmo/wijmo.angular2.chart';
import { AppComponent } from './components/app.component';
import { DataService } from './services/data.service';

@NgModule({
    imports: [ WjChartModule, BrowserModule],
    declarations: [AppComponent],
    providers:[DataService],
    bootstrap: [AppComponent],
})

export class AppModule { }