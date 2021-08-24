import { Component, Inject } from '@angular/core';
import { DataService } from '../services/data.service';

@Component ({
    selector:'app-cmp',
    templateUrl:'app/components/app.component.html',
})
export class  AppComponent{
    protected dataSvc:DataService;
    data: wijmo.collections.CollectionView;
    constructor(@Inject(DataService) dataSvc:DataService){
        this.dataSvc = dataSvc;
        this.data = new wijmo.collections.CollectionView(this.dataSvc.getData(50));
        // console.log(this.dataSvc);
    }
}