import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  public checkin(firstname: string, lastname: string, phonenumber: string, email: string, inputcompany: string, street: string, postalcode: string, city: string): void{
    if (firstname == '' || lastname == '' || phonenumber == '' || email == '' || street == '' || postalcode == '' || city == ''){
      this._snackBar.open('Required Field is empty!', 'OK', {
        duration: 2500,
        panelClass: ['snackbar']
      });

      return;
    }
    
    
    let company = ' ';

    if (inputcompany != ''){
      company = inputcompany;
    }
    
    const params = {
      firstname: firstname,
      lastname: lastname,
      phonenumber: phonenumber,
      email: email,
      company: company,
      street: street,
      postalcode: postalcode,
      city: city
    }

    const url = ApiConfig.base + ApiConfig.checkin + firstname + '&' + lastname + '&' + phonenumber + '&' + email + '&' + company + '&' + street + '&' + postalcode + '&' + city;

    this.httpClient.post<any>(url, params)
    .subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('checkininfo', {state: {"checkinId": response.generated_keys}})
      },
      error: (error) => this.logger.log('Something went wrong'),
      complete: () => this.logger.log('checkin created')
    })
  }
}
