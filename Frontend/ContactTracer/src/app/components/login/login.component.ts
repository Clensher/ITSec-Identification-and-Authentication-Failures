import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errormsg = '';
  hide = true;

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  public loginAdmin(username: string, password: string): void{

    if (username == '' || password == ''){
      this._snackBar.open('You have to enter a username and a password!', 'OK', {
        duration: 2500,
        panelClass: ['snackbar']
      });

      return;
    }

    const url = ApiConfig.base + ApiConfig.adminLogin + username + '&' + password;

    this.httpClient.get<any>(url, {})
    .subscribe({
      next: (response: any) => {
        if ('adminExists' in response){
          this._snackBar.open('The username or password is wrong!', 'OK', {
            duration: 2500,
            panelClass: ['snackbar']
          });
        }
        else{
          this.router.navigateByUrl('adminhome', {state: {'username': username, 'password': password}})
        }
      },
      error: (error) => this.logger.log('Something went wrong'),
      complete: () => this.logger.log('admin tried to login')
    })
  }
}
