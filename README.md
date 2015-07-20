## Norwegian Polar Data Centre (v2)

Container repository for http://data.npolar.no, consisting of a number of independent [AngularJS](angular/angular.js)-based web applications.

Each NPDC application ([list](https://github.com/npolar?utf8=%E2%9C%93&query=npdc)) is built, tested and deployed via [npdc-gulp](npolar/npdc-gulp), gets common UI and other shared code from [npdc-common], and interacts with the [Npolar API](https://api.npolar.no) using [npolar-angular].
See the [wiki] for more details.


### Run
```
npm start
```