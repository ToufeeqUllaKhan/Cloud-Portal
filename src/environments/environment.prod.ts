export const environment = {
  appVersion: require('../../package.json').version,
  production: true,
  /** for dev i.e sscportaldev.azurewebsites.net portal **/
  apiUrl: 'https://ssportalservicesdev.azurewebsites.net',
  // zipUrl: 'https://sscazurefunctionsdev.azurewebsites.net',
  zipUrl: 'https://sscazurefunctionsdev.azurewebsites.net',
  
  /** For prod  i.e sscloudportal.azurewebsites.net portal  **/
  // apiUrl: 'https://ssportalservices.azurewebsites.net',
  // zipUrl: 'https://sscportalazurefunctions.azurewebsites.net',

    /** For prod  i.e sscportalinternal.azurewebsites.net portal only one user **/
  // apiUrl: 'https://sscportalservicesinternal.azurewebsites.net/',
  // zipUrl: 'https://sscportalazurefunctions.azurewebsites.net',
  
  getuidurl: 'https://wittportalservice.azurewebsites.net',
  // decodeUrl:'https://additlabservices.azurewebsites.net'
  };
