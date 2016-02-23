# angular-gAnalytics

[![Build Status via Travis CI](https://travis-ci.org/mo3taz-abdallh/angular-gAnalytics.svg?branch=server)](https://travis-ci.org/mo3taz-abdallh/angular-gAnalytics)

Consuming Google Analytics Core Reporting Service (Server - Server) Auth to display Reports &amp; dashboards with angularJS, NodeJS &amp; Google Charts.

# Full setup
1. Install [Node.js](http://nodejs.org/)
2. Install [Gulp](http://gulpjs.com/)
3. clone Repo

```javascript
$ git clone https://github.com/mo3taz-abdallh/angular-gAnalytics.git
```

OR

```javascript
$ npm install angular-ganalytics
```

4. Install dependencies

```javascript
$ npm install
```

5. Install bower components

```javascript
$ bower install
```

6. Start server backend

```javascript
$ cd server
$ node server.js
```

7. Start frontend

```javascript
$ gulp serve
```
# Server NodeJs Backend
Follow these steps before deploying your server:

1. Register an application in [Google API console center](https://console.developers.google.com/project).
2. Enable Analytics API.
3. Create a service account [Manage Service Account] (https://console.developers.google.com/permissions/serviceaccounts).
4. Register the newly created service account email into the Google Analytics property in permission section under property administration.
5. Create New Credentials (Service Account private Key **.p12**) [Manage Credentials] (https://console.developers.google.com/apis/credentials).
6. Transform your **.p12** key to **.pem** to sign yours **JWT**, in order to achieve that you should have **openSSl** installed on your machine
 ```
> openssl pkcs12 -in YOUR_PRIVATE_KEY_FILE.p12 -out demo_certificate.pem -nodes
```
7. You should store your **pem** key in safe place on your server.
8. Update **config.js** file

```javascript
'GA_SERVICE_ACCOUNT': 'GOOGLE SERVICE ACCOUNT',
'GA_KEY_PATH': "PEM KEY PATH",
```
9. Upload Server folder to your server

# frontend AngularJS
Follow these steps before using gulp serve:

1. Go to config.json folder /src/config, 
1.1. Change **serverUrl** to backend server url

```javascript
'serverUrl': 'YOUR_BACKEND_SERVER_URL,
```

1.2. Update group items change property name & property id, you could get your property id from [GA Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/)

```javascript
{
  "label": "PROPERTY_NAME",
  "id": "PROPERTY_ID",
  "group": "PROPERTY_GROUP_NAME"
}
```

2. Go to config.json folder /src/config/queries/PROPERTY_GROUP_NAME, change **analyticsItems** that would appear as tabs 

```javascript
{
   "id": "sessions-users",  //Query ID
   "label": "Users/Sessions",  //Label that would be text for this tab
   "url": "/analytics/sessions-users", //
   "state": "home.dynamic-analytics", //angular ui-state
   "views": [
        "Grid",
        "Chart"
      ],
    "query_file": "config/queries/mp3quran/sessions-users-query.json" //Query File
}
```

3. Edit your query file you could test your query from here [GA Query Explorer](https://ga-dev-tools.appspot.com/query-explorer/)

4. Build your server through gulp

```javascript
gulp build --minify
```
