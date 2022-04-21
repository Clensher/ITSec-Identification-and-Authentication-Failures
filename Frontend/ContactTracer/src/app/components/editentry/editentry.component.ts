import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-editentry',
  templateUrl: './editentry.component.html',
  styleUrls: ['./editentry.component.scss']
})
export class EditentryComponent implements OnInit {

  private username = '';
  private password = '';
  public entry: any;

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService) { }

  ngOnInit(): void {
    
    this.username = history.state.username;
    this.password = history.state.password;
    this.entry = history.state.entry;

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

  public editEntry(firstname: string, lastname: string, phonenumber: string, email: string, inputcompany: string, street: string, postalcode: string, city: string): void{
    let company = ' ';

    if (inputcompany != ''){
      company = inputcompany;
    }
    
    const params = {
      username: this.username,
      password: this.password,
      id: this.entry.id,
      firstname: firstname,
      lastname: lastname,
      phonenumber: phonenumber,
      email: email,
      company: company,
      street: street,
      postalcode: postalcode,
      city: city
    }

    const url = ApiConfig.base + ApiConfig.editEntry + this.username + '&' + this.password + '&' + this.entry.id + '&' + firstname + '&' + lastname + '&' + phonenumber + '&' + email + '&' + company + '&' + street + '&' + postalcode + '&' + city;

    this.httpClient.put<any>(url, params)
    .subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('entries', {state: {'username': this.username, 'password': this.password}})
      },
      error: (error) => this.logger.log('Something went wrong'),
      complete: () => this.logger.log('checkin created')
    })
  }

  public deleteEntry(): void{
    const params = {
      username: this.username,
      password: this.password,
      id: this.entry.id,
    }

    const url = ApiConfig.base + ApiConfig.deleteEntry + this.username + '&' + this.password + '&' + this.entry.id;

    this.httpClient.delete<any>(url)
    .subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('entries', {state: {'username': this.username, 'password': this.password}})
      },
      error: (error) => this.logger.log('Something went wrong'),
      complete: () => this.logger.log('checkin created')
    })
  }
}