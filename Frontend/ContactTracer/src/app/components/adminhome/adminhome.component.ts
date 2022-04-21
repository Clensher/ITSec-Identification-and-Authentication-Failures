import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.scss']
})
export class AdminhomeComponent implements OnInit {

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
  }

  public entries(): void{
    this.router.navigateByUrl('entries', {state: {'username': this.username, 'password': this.password}})
  }

  public edit(): void{
    this.router.navigateByUrl('editadmin', {state: {'username': this.username, 'password': this.password}})
  }

  public logout(): void{
    this.router.navigateByUrl('home')
  }
}
