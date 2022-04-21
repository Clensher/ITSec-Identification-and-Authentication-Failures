import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkininfo',
  templateUrl: './checkininfo.component.html',
  styleUrls: ['./checkininfo.component.scss']
})
export class CheckininfoComponent implements OnInit {

  public id: string = '';

  constructor() { }

  ngOnInit(): void {
    this.id = history.state.checkinId;
  }
}
