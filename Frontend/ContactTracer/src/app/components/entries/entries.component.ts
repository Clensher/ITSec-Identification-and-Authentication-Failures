import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '12em'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EntriesComponent implements OnInit {

  dataSource: Entry[] = [];
  columnsToDisplay = ['firstname', 'lastname', 'phonenumber', 'email', 'company', 'street', 'postalcode', 'city', 'checkintime', 'checkouttime', 'edit'];
  expandedElement: Entry[] = [];

  private username = '';
  private password = '';

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService) { }

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

    const url2 = ApiConfig.base + ApiConfig.entries + this.username + '&' + this.password;

    this.httpClient.get<Array<Entry>>(url2, {})
    .subscribe({
      next: (response: Array<Entry>) => {
        this.dataSource = response;
      },
      error: (error) => this.logger.log('Something went wrong')
    })
  }

  adminCheckin(): void{
    this.router.navigateByUrl('admincheckin', {state: {'username': this.username, 'password': this.password}})
  }

  adminHome(): void{
    this.router.navigateByUrl('adminhome', {state: {'username': this.username, 'password': this.password}})
  }

  dateToString(data: string): string{
    return new Date(data).toLocaleString();
  }

  dateToStringCheckout(data: string, checkedOut: boolean): string{
    if (checkedOut){
      return new Date(data).toLocaleString();
    }
    else{
      return '';
    }
  }

  editEntry(entry: Entry): void{
    this.router.navigateByUrl('editentry', {state: {'username': this.username, 'password': this.password, 'entry': entry}})
  }
}

export interface Entry {
  id: string,
  firstname: string,
  lastname: string,
  phonenumber: string,
  email: string,
  company: string,
  street: string,
  postalcode: string,
  city: string,
  checkedOut: boolean,
  checkinTime: Date,
  checkoutTime: Date
}