import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginTrysCounterService {
  counter = 0;
  constructor() { }

  increase(){
    this.counter++;
  }

  maximumReached() : boolean {
    return this.counter >= 3;
  }
}
