import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  public checkout(id: string): void{

    if (id == ''){
      this._snackBar.open('You have to enter an ID', 'OK', {
        duration: 2500,
        panelClass: ['snackbar']
      });

      return;
    }

    const params = {
      id: id
    }

    const url = ApiConfig.base + ApiConfig.checkout + id;

    this.httpClient.put<any>(url, params)
    .subscribe({
      next: (response: any) => {
        if ("checkedOut" in response){
          this._snackBar.open('ID already checked out!', 'OK', {
            duration: 2500,
            panelClass: ['snackbar']
          });
        }
        else if ("entryExists" in response){
          this._snackBar.open('ID does not exist!', 'OK', {
            duration: 2500,
            panelClass: ['snackbar']
          });
        }
        else{
          this.router.navigateByUrl('checkoutinfo', {state: {"checkinId": response.generated_keys}})
        }
      },
      error: (error) => this.logger.log('Something went wrong')
    })
  }
}
