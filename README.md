## Norwegian Polar Data Centre (v2)

Container repository for http://data.npolar.no, consisting of a number of independent [AngularJS](https://github.com/angular/angular.js)-based web applications.

Each NPDC application ([list](https://github.com/npolar?utf8=%E2%9C%93&query=npdc)) is built,tested and deployed via [npdc-gulp](https://github.com/npolar/npdc-gulp),
gets common UI and other shared code from [npdc-common](https://github.com/npolar/npdc-common), and interacts with the [Npolar API](https://api.npolar.no) using [angular-npolar](https://github.com/npolar/angular-npolar).
See the [wiki](https://github.com/npolar/npdc/wiki) for details.

### Run
```
npm start
```