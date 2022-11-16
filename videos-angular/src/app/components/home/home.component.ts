import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {

  public page_title: string;
  public identity: any

  constructor(
    private _userService: UserService
  ) {
    this.page_title = ""
    this.identity = _userService.getIdentity()
  }

  ngOnInit(): void {
  }

}
