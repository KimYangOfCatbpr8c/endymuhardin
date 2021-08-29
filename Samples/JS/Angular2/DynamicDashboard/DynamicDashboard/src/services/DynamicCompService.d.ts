import { ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
export declare class DynamicCompService {
    private componentFactoryResolver;
    constructor(componentFactoryResolver: ComponentFactoryResolver);
    createDynaComp(vCref: ViewContainerRef, tileType: string): ComponentRef<any>;
    removeComp(vCref: ViewContainerRef, idx: number): void;
    moveComp(vCref: ViewContainerRef, idx1: number, idx2: number): void;
}
