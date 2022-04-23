import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  hide = true;

  public registerAdmin(firstname: string, lastname: string, email: string, username: string, password: string): void{
    
    if (firstname == '' || lastname == '' || email == '' || username == '' || password == ''){
      this._snackBar.open('Required Field is empty!', 'OK', {
        duration: 2500,
        panelClass: ['snackbar']
      });

      return;
    }
    
    const params = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password
    }

    const url = ApiConfig.base + ApiConfig.adminRegister + firstname + '&' + lastname + '&' + email + '&' + username + '&' + password;

    this.httpClient.post<any>(url, params)
    .subscribe({
      next: (response: any) => {
        if (response.errors == 0){
          this.logger.log('admin registered');
          this.router.navigateByUrl('adminhome', {state: {'username': username, 'password': password}});
        }
        else if (response.errorSource == "password"){
          this._snackBar.open(response.passwordPolicyDescription, 'ERROR', {
            duration: 4500,
            panelClass: ['snackbar']
          });
        }
      },
      error: (error) => this.logger.log('Something went wrong')
    })
  }
}
