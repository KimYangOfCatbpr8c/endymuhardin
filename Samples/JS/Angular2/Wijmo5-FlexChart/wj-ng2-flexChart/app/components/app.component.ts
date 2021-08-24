import { Component, Inject } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
    selector: 'app-cmp',
    templateUrl: 'app/components/app.component.html',
})
export class AppComponent {
    protected dataSvc: DataService;
    countries = 'US,Germany,UK,Japan,Italy,Greece'.split(',');
    data: { country: string, downloads: number, sales: number, expenses: number }[];

    constructor( @Inject(DataService) dataSvc: DataService) {
        this.dataSvc = dataSvc;
        this.data = this.dataSvc.getData(this.countries);
    }
}