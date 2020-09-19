import { Injectable } from '@angular/core';

@Injectable()
export class Data {

  getData() {
    return {
      "draw": 4,
      "recordsTotal": 57,
      "recordsFiltered": 57,
      "data": [
        {
          "first_name": "Jennifer",
          "last_name": "Acosta",
          "position": "Junior Javascript Developer",
          "office": "Edinburgh",
          "start_date": "1st Feb 13",
          "salary": "$75,650"
        },
        {
          "first_name": "Jonas",
          "last_name": "Alexander",
          "position": "Developer",
          "office": "San Francisco",
          "start_date": "14th Jul 10",
          "salary": "$86,500"
        },
        {
          "first_name": "Lael",
          "last_name": "Greer",
          "position": "Systems Administrator",
          "office": "London",
          "start_date": "27th Feb 09",
          "salary": "$103,500"
        },
        {
          "first_name": "Martena",
          "last_name": "Mccray",
          "position": "Post-Sales support",
          "office": "Edinburgh",
          "start_date": "9th Mar 11",
          "salary": "$324,050"
        },
        {
          "first_name": "Michael",
          "last_name": "Silva",
          "position": "Marketing Designer",
          "office": "London",
          "start_date": "27th Nov 12",
          "salary": "$198,500"
        },
        {
          "first_name": "Michael",
          "last_name": "Bruce",
          "position": "Javascript Developer",
          "office": "Singapore",
          "start_date": "27th Jun 11",
          "salary": "$183,000"
        },
        {
          "first_name": "Michelle",
          "last_name": "House",
          "position": "Integration Specialist",
          "office": "Sidney",
          "start_date": "2nd Jun 11",
          "salary": "$95,400"
        },
        {
          "first_name": "Olivia",
          "last_name": "Liang",
          "position": "Support Engineer",
          "office": "Singapore",
          "start_date": "3rd Feb 11",
          "salary": "$234,500"
        },
        {
          "first_name": "Paul",
          "last_name": "Byrd",
          "position": "Chief Financial Officer (CFO)",
          "office": "New York",
          "start_date": "9th Jun 10",
          "salary": "$725,000"
        },
        {
          "first_name": "Prescott",
          "last_name": "Bartlett",
          "position": "Technical Author",
          "office": "London",
          "start_date": "7th May 11",
          "salary": "$145,000"
        }
      ]
    }

  }
}
