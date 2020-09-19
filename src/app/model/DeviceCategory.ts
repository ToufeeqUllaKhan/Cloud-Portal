
export class DeviceCategory {

  //console.log(obj['CrossReferenceByBrands']['DeviceCategory'][0]['@attributes']['Name']);
  // console.log(obj['CrossReferenceByBrands']['DeviceCategory'][0]['Brands'][0]['@attributes']);
 // console.log(obj['CrossReferenceByBrands']['DeviceCategory'][0]['Brands']['Brand'][0]['@attributes']['Name']);
 // console.log(obj['CrossReferenceByBrands']['DeviceCategory'][0]['Brands']['Brand'][0]['CodeSets']['CodeSetId']);
  
  "@attributes": { "Name": "" };
 
  "Brands": any = {
    "Brand": [{ "@attributes": { "Name": "" },"CodeSets":{ "CodeSetId": [] }}]}

}
