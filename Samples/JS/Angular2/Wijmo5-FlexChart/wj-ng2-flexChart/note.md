## 使用Wimo & Angular 2 创建 FlexChart

上次我们使用 Wijmo 和 Angular 2 创建了第一个小应用，[从零开始构建 Wijmo & Angular 2 小应用](http://www.cnblogs.com/likeFlyingFish/p/6043105.html)， 现在就来看看如何使用 Wijmo & Angular 2 构建一个 FlexChart 。

###1.新建我们的项目。 

```
$ mkdir wj-ng2-flexgrid
$ cd wj-ng2-flexgrid
```
*** 
###2.配置项目。

我们需要下面 3 个配置文件。

- package.json 。 用来标记项目需要使用的npm依赖包。 
- tsconfig.json 。 这个是typescript的配置文件，定义了 TypeScript 编译器如何从项目源文件生成 JavaScript 代码。 
- systemjs.config.js 。 为模块加载器SystemJS 提供了该到哪里查找应用模块的信息，并注册了所有必备的依赖包 。（这里使用SystemJS 来配置模块，也可以使用Webpcak，神一般的利器。详情请参考博客园专家级人物 冠军 的博客： http://www.cnblogs.com/haogj/p/5998556.html#3541215）
如果不太明白配置文件中键值对的意义，可以在底部留言或者上网查询。

->>package.json 
``` json
{
  "name": "wj-ng2-flexchart",
  "version": "1.0.0",
  "scripts": {
    "start": "tsc && concurrently \"tsc -w\" \"lite-server\" ",
    "lite": "lite-server",
    "tsc": "tsc",
    "tsc:w": "tsc -w"
  },
  "licenses": [
    {
      "type": "MIT",
      "url": "https://github.com/angular/angular.io/blob/master/LICENSE"
    }
  ],
  "dependencies": {
    "@angular/common": "~2.1.1",
    "@angular/compiler": "~2.1.1",
    "@angular/core": "~2.1.1",
    "@angular/forms": "~2.1.1",
    "@angular/http": "~2.1.1",
    "@angular/platform-browser": "~2.1.1",
    "@angular/platform-browser-dynamic": "~2.1.1",
    "@angular/router": "~3.1.1",
    "@angular/upgrade": "~2.1.1",
    "angular-in-memory-web-api": "~0.1.13",
    "core-js": "^2.4.1",
    "reflect-metadata": "^0.1.8",
    "rxjs": "5.0.0-beta.12",
    "systemjs": "0.19.39",
    "zone.js": "^0.6.25"
  },
  "devDependencies": {
    "@types/core-js": "^0.9.34",
    "@types/node": "^6.0.45",
    "concurrently": "^3.0.0",
    "lite-server": "^2.2.2",
    "typescript": "^2.0.3"
  }
}

```



->> tsconfig.json 
``` json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  }
}
```
->> systemjs.config.js
``` javascript
/**
* System configuration for Angular samples
* Adjust as necessary for your application needs.
*/
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
      // other libraries
      'rxjs':                      'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})(this);
```

安装依赖包。

在当前目录下，运行
```
$ npm install 
```
所有依赖包会全部下载下来，如果命令行有警告，可以忽略 。这些警告表示包里没有repository field，这些field仅仅用于一些包信息。

如果因为某些原因包无法下载，那可以使用淘宝的镜像 [cnpm](https://npm.taobao.org/)。这个镜像会每隔10分钟和官方同步一次。

安装结束，会在项目的根目录下多出一个node_modules 文件夹，它实在是太大了 ！

现在您需要将 \wijmoEnterprise\Samples\TS\Angular2\FlexGridIntro\FlexGridIntro\node_modules\wijmo 文件夹拷贝到当前项目中的 node_modules 文件夹。这些文件用来将wijmo包包装为 es6 模块。



好了，现在的准备工作已经完成了，您可以开始创建wijmo & Angular 2 的应用了。

***

###3. 创建目录

玩Angular 2，首先我们需要Angular 2的脚手架。

现在来看看我的文件目录，并逐一解释。
```

└─ wj-ng2-flexchart/ ······························· 项目所在目录
   ├─ node_modules/ ······························· 项目依赖包
   ├─ app/ ········································ 应用程序子目录
   │  ├─ components/ ······························ 组件目录
   │  │  ├─ app.component.html ···················· 根组件app.Component模板
   │  │  └─ app.conponent.ts ······················ 根组件app.Component
   │  ├─ services/ ································ 服务目录
   │  │  └─ data.service.ts ······················· 数据服务 data.Service
   │  ├─ app.module.ts ···························· 根模块app.module
   │  └─ main.ts ·································· Angular 引导文件
   ├─ scripts/ ···································· 外部js 目录
   │  ├─ definition/ ······························ wijmo 模块定义目录
   │  └─ vendor/ ·································· wijmo 脚本目录
   ├─ styles/ ····································· 样式目录
   ├─ index.html ·································· 应用宿主页面
   ├─ package.json ································ npm 依赖列表
   ├─ systemjs.config.js ·························· systemJS 配置
   ├─ tsconfig.js ································· TypeScript 配置
   └─ readme.md ··································· 程序说明

 
```
      


这看起来似乎比较复杂，但是却很有条理。

***

###4. 编写宿主页面

在宿主页面中，除了Angular 2中必须的组件，还需要引入Wijmo js脚本。
``` html
<html>
<head>
    <meta charset="UTF-8">
    <title>使用 Angular 2 来创建FlexGrid控件</title>
    <!--angular 2 模块开始 -->
    <!--用于填充旧版浏览器-->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <!--systemjs 配置开始-->
    <script src="systemjs.config.js"></script>
    
    <!--wijmo 模块开始-->
    <script src="scripts/vendor/wijmo.min.js"></script>
    <script src="scripts/vendor/wijmo.chart.min.js"></script>
    <link rel="stylesheet" href="styles/wijmo.min.css">
    <script src="scripts/vendor/wijmo.angular2.min.js"></script>
    <!--mine-->
    <script>
      System.import('./app/main').catch(function(err){ console.error(err); });
    </script>
</head>
<body>
    <!--申明根组件-->
    <app-cmp>
        Loading ...
    </app-cmp>
</body>
</html>
```
***
###5. 编写数据服务

这个页面定义完毕，现在来编写一个数据服务。这个数据服务需要被注入到组件中，因此需要引入一个元标记 Injectable 。

data.Service 返回一些国家相关信息的随机数据。
``` javascript
'use strict'

import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    getData(countries: string[]): any[] {
        var data = [];
        for (let i = 0; i < countries.length; i++) {
            data.push({
                country: countries[i],
                downloads: Math.round(Math.random() * 20000),
                sales: Math.random() * 10000,
                expenses: Math.random() * 5000
            });
        }
        return data;
    };
}

```

***
###6. 编写根组件和模块

现在我们编写应用的第一个组件：根组件 app.component ,也是这个程序唯一的组件。

``` javascript

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
```
在这个组件中，需要引入两个元标记。Component, Inject ，还需要注入定义的数据服务data.Service。

在组件app.component.html模板中，
``` html


<div>
	<wj-flex-chart [itemsSource]="data" [bindingX]="'country'">
		<wj-flex-chart-series [name]="'Sales'" [binding]="'sales'"></wj-flex-chart-series>
		<wj-flex-chart-series [name]="'Expenses'" [binding]="'expenses'"></wj-flex-chart-series>
		<wj-flex-chart-series [name]="'Downloads'" [binding]="'downloads'"></wj-flex-chart-series>
	</wj-flex-chart>
</div>

```
在这里，仅仅需要引入一个 ```wj-flex-grid``` 标记，就可以创建一个 flexgrid控件了，```wj-flex-grid``` 组件是作为一个子组件存在的，在app.module 模块中注入。
通过wj-flex-chart-series 来申明系列，通过bindling 来指定绑定的字段。
itemsSource 绑定一个数据源，这个itemsSource是flexgrid已经封装完成的属性。在 flexgrid 内部是通过 @Input 来完成的。

在根模块中将组件注入
``` javascript
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
```

在这里，需要将引用的所有的组件和模块都要注入进来。


***
###7. 引导和启动引用 

最后是引导程序 main.ts
``` javascript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import { AppModule } from './app.module';
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
```


 

在根目录下，运行 
```
$ npm start
```
 这时，程序会自动打开默认浏览器并渲染页面。

>start 命令是执行定义在 package.json 文件中的scripts命令。  会将ts代码编译为原生js，并且会启动一个静态服务器。 这个服务器会检测文件的变化，当发现文件改动，那么会自动编译ts代码。

***

![效果截图](![](http://images2015.cnblogs.com/blog/857465/201611/857465-20161109111636561-530904138.png)
