import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-editadmin',
  templateUrl: './editadmin.component.html',
  styleUrls: ['./editadmin.component.scss']
})
export class EditadminComponent implements OnInit {

  hide = true;

  public username = '';
  public password = '';

  public firstname: string = "";
  public lastname: string = "";
  public email: string = "";


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
        else{
          this.firstname = response[0].firstname;
          this.lastname = response[0].lastname;
          this.email = response[0].email;
        }
      },
      error: (error) => this.logger.log('Something went wrong')
    })
  }

  editAdmin(firstnameInput: string, lastnameInput: string, emailInput: string, usernameInput: string, passwordInput: string): void{
    
    if (firstnameInput == '' || lastnameInput == '' || emailInput == '' || usernameInput == '' || passwordInput == ''){
      this._snackBar.open('Required Field is empty!', 'OK', {
        duration: 2500,
        panelClass: ['snackbar']
      });

      return;
    }
    
    const params = {
      username: this.username,
      password: this.password,
      firstname: firstnameInput,
      lastname: lastnameInput,
      email: emailInput,
      newusername: usernameInput,
      newpassword: passwordInput
    }

    const url = ApiConfig.base + ApiConfig.editadmin + this.username + '&' + this.password + '&' + firstnameInput + '&' + lastnameInput + '&' + emailInput + '&' + usernameInput + '&' + passwordInput;

    this.httpClient.put<any>(url, params)
    .subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('login')
      },
      error: (error) => this.logger.log('Something went wrong'),
      complete: () => this.logger.log('admin registered')
    })
  }
}
