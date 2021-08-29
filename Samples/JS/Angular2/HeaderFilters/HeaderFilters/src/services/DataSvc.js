'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
// Common data service
var DataSvc = (function () {
    function DataSvc() {
    }
    // create book data
    DataSvc.prototype.getBooks = function () {
        return [
            { sales: -100, title: 'Boris Godunov', url: 'http://en.wikipedia.org/wiki/Boris_Godunov', author: 'Alexandr Pushkin', price: 7.15, instore: true, shipping: 1, bestseller: false, pub: new Date(1999, 1, 1) },
            { sales: -200, title: 'The Rainmaker', url: 'http://en.wikipedia.org/wiki/The_Rainmaker_(John_Grisham)', author: 'John Grisham', price: 7.99, instore: false, shipping: 48, bestseller: false, pub: new Date(2001, 12, 1) },
            { sales: 350, title: 'The Green Mile', url: 'http://en.wikipedia.org/wiki/The_Green_Mile_(novel)', author: 'Stephen King', price: 11.1, instore: true, shipping: 24, bestseller: false, pub: new Date(1992, 1, 1) },
            { sales: 700, title: 'Misery', url: 'http://en.wikipedia.org/wiki/Misery_(novel)', author: 'Stephen King', price: 7.7, instore: false, shipping: null, bestseller: false, pub: new Date(2003, 1, 1) },
            { sales: -1200, title: 'The Dark Half', url: 'http://en.wikipedia.org/wiki/The_Dark_Half', author: 'Stephen King', price: 0, instore: false, shipping: 48, bestseller: false, pub: new Date(1999, 10, 30) },
            { sales: 1500, title: 'The Partner', url: 'http://en.wikipedia.org/wiki/The_Partner', author: 'John Grisham', price: 12.99, instore: true, shipping: 48, bestseller: true, pub: new Date(2005, 1, 1) },
            { sales: 500, title: 'It', url: 'http://en.wikipedia.org/wiki/It_(novel)', author: 'Stephen King', price: 9.7, instore: false, shipping: null, bestseller: false, pub: new Date(2001, 10, 15) },
            { sales: 400, title: 'Cousin Bette', url: 'http://en.wikipedia.org/wiki/Cousin_Bette', author: 'Honore de Balzac', price: 0, instore: true, shipping: 1, bestseller: false, pub: new Date(1991, 12, 1) },
            { sales: 1500, title: 'The Testament', url: 'http://en.wikipedia.org/wiki/The_Testament', author: 'John Grisham', price: 19.1, instore: true, shipping: 48, bestseller: false, pub: new Date(1999, 12, 17) },
            { sales: 800, title: 'Eugene Onegin', url: 'http://en.wikipedia.org/wiki/Eugene_Onegin', author: 'Alexandr Pushkin', price: 11.2, instore: true, shipping: 24, bestseller: false, pub: new Date(2005, 9, 27) },
            { sales: -300, title: 'Dark Avenues', url: 'http://en.wikipedia.org/wiki/Dark_Avenues', author: 'Ivan Bunin', price: 14.96, instore: true, shipping: 1, bestseller: false, pub: new Date(2008, 10, 1) },
            { sales: 150, title: 'Father Goriot', url: 'http://en.wikipedia.org/wiki/Le_P%C3%A8re_Goriot', author: 'Honore de Balzac', price: 9.99, instore: false, shipping: 48, bestseller: false, pub: new Date(2010, 6, 6) },
            { sales: 650, title: 'The Captain\'s Daughter', url: 'http://en.wikipedia.org/wiki/The_Captain\'s_Daughter', author: 'Alexandr Pushkin', price: 10.21, instore: false, shipping: 48, bestseller: false, pub: new Date(2001, 3, 1) },
            { sales: -100, title: 'Hamlet', url: 'http://en.wikipedia.org/wiki/Hamlet', author: 'William Shakespeare', price: 5.99, instore: true, shipping: 1, bestseller: false, pub: new Date(2003, 4, 15) },
            { sales: 1300, title: 'The Village', url: 'http://en.wikipedia.org/wiki/The_Village_(Bunin_novel)', author: 'Ivan Bunin', price: 11.66, instore: false, shipping: 24, bestseller: false, pub: new Date(2010, 1, 2) },
            { sales: 700, title: 'The Winter\'s', url: 'http://en.wikipedia.org/wiki/The_Winter', author: 'William Shakespeare', price: 19.31, instore: true, shipping: 1, bestseller: false, pub: new Date(2010, 2, 12) },
            { sales: 250, title: 'The Black Sheep', url: 'http://en.wikipedia.org/wiki/Black_sheep', author: 'Honore de Balzac', price: 16, instore: true, shipping: 1, bestseller: false, pub: new Date(1976, 8, 28) },
            { sales: -80, title: 'Lost Illusions', url: 'http://en.wikipedia.org/wiki/Illusions_perdues', author: 'Honore de Balzac', price: 8.1, instore: true, shipping: null, bestseller: false, pub: new Date(2010, 7, 10) },
        ];
    };
    DataSvc = __decorate([
        core_1.Injectable()
    ], DataSvc);
    return DataSvc;
}());
exports.DataSvc = DataSvc;
//# sourceMappingURL=DataSvc.js.map