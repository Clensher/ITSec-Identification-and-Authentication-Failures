import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-admincheckin',
  templateUrl: './admincheckin.component.html',
  styleUrls: ['./admincheckin.component.scss']
})
export class AdmincheckinComponent implements OnInit {

  private username = '';
  private password = '';

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    this.username = history.state.username;
    this.password = history.state.password;

    const url = ApiConfig.base + ApiConfig.adminLogin + this.username + '&' + this.password;

    this.httpClient.get<any>(url, {})
    .subscribe({
      next: (response: any) => {
        if ('adminExists' in response){
          this.logger.log('invalid admin')
          this.router.navigateByUrl('login')
        }
      },
      error: (error) => this.logger.log('Something went wrong')
    })
  }

  public admincheckin(firstname: string, lastname: string, phonenumber: string, email: string, inputcompany: string, street: string, postalcode: string, city: string): void{
    
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
      username: this.username,
      password: this.password,
      firstname: firstname,
      lastname: lastname,
      phonenumber: phonenumber,
      email: email,
      company: company,
      street: street,
      postalcode: postalcode,
      city: city
    }

    const url = ApiConfig.base + ApiConfig.admincheckin + this.username + '&' + this.password + '&' + firstname + '&' + lastname + '&' + phonenumber + '&' + email + '&' + company + '&' + street + '&' + postalcode + '&' + city;

    this.httpClient.post<any>(url, params)
    .subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('entries', {state: {'username': this.username, 'password': this.password}})
      },
      error: (error) => this.logger.log('Something went wrong'),
      complete: () => this.logger.log('admin created checkin')
    })
  }
}
