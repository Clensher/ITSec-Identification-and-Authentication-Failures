import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.scss']
})
export class RegisterAdminComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private httpClient: HttpClient,private registerFormBuilder: FormBuilder, private router: Router, private logger: LoggerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.registerForm = this.registerFormBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})"))]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: [this.isPasswordMatching('password', 'confirmPassword')]
    });
  }

  hide = true;

  public registerAdmin(){
    if (this.registerForm.invalid) {
      this._snackBar.open('Required Field is invalid or empty!', 'OK', {
        duration: 2500,
        panelClass: ['snackbar']
      });
    }

    const params = {
      firstname: this.registerForm.value.firstname,
      lastname: this.registerForm.value.lastname,
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    }

    const url = ApiConfig.base + ApiConfig.adminRegister + params.firstname + '&' + params.lastname + '&' + params.email + '&' + params.username + '&' + params.password;

    this.httpClient.post<any>(url, params)
      .subscribe({
        next: (response: any) => {
          this.router.navigateByUrl('adminhome', {state: {'username': params.username, 'password': params.password}})
        },
        error: (error) => this.logger.log('Something went wrong'),
        complete: () => this.logger.log('admin registered')
      });

  }


  private isPasswordMatching(password: string, confirmPassword: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(password);
      const checkControl = controls.get(confirmPassword);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(confirmPassword)?.setErrors({matching: true});
        return {matching: true};
      } else {
        return null;
      }
    };
  }

}
