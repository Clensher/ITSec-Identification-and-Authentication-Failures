import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ApiConfig from '../../../assets/config/api-config.json'
import { LoggerService } from '../../../assets/services/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router: Router, private logger: LoggerService) { }

  ngOnInit(): void {
  }

  public login(): void{
    this.router.navigateByUrl('login')
  }

  public checkin(): void{
    this.router.navigateByUrl('checkin')
  }

  public checkout(): void{
    this.router.navigateByUrl('checkout')
  }

  public register(): void{
    this.router.navigateByUrl('registeradmin')
  }
}
