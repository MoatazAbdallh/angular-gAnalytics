# angular-gAnalytics
Consuming Google Analytics Core Reporting Service (Server - Server) Auth to display Reports &amp; dashboards with angularJS, NodeJS &amp; Google Charts.

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
