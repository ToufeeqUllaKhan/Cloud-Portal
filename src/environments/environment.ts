// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appVersion: require('../../package.json').version,
  production: false,
 // apiUrl: 'https://sscportalservicesrev2.azurewebsites.net',
  /** ssc_sprint4  **/
  //apiUrl: 'https://sscservicepro.azurewebsites.net',
  /** ssc_sprint4c  **/
  //apiUrl: 'https://sscserviceprosa.azurewebsites.net',
  /** Portal Website  **/
  //apiUrl: 'https://sscportal.azurewebsites.net',
  /** DBEU01001 Prod Temp Testing  **/
  //apiUrl: 'https://dbeu01001dev.azurewebsites.net',
  /** DBSA01002.Dev11  **/
  //apiUrl: 'https://dbsa01001dev.azurewebsites.net',
  /** Prod Portal Config  **/
  apiUrl: 'https://ssportalservices.azurewebsites.net',
  /** Prod Portal Website  **/
  //apiUrl: 'https://sscloudportal.azurewebsites.net',
  //zipUrl: 'https://zipprocessing.azurewebsites.net'
  /** for prod zip url  **/
  zipUrl: 'https://sscportalazurefunctions.azurewebsites.net'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
