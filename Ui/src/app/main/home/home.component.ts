import { Component, OnInit } from '@angular/core';
import { defaultFamily } from '../../consts/consts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public familyId: number = defaultFamily.id;
  public memberId: number = defaultFamily.memberId;

  constructor() { }

  ngOnInit(): void {
  }

}
