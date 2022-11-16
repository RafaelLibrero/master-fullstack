import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string
  public user: User
  public identity: any
  public status: string
  public token: string

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = "Identificate"
    this.user = new User(1, '', '', '', '', 'ROLE_USER', '')
    this.status = ""
    this.token = ""
  }
  
  ngOnInit(): void {
  }

  onSubmit(form: any){
    this._userService.login(this.user).subscribe(
      response => {
        if(!response.status || response.status != 'error'){
          this.status = 'success'
          this.identity = response

          this._userService.login(this.user, true).subscribe(
            response => {
              if(!response.status || response.status != 'error'){
                this.token = response;

                console.log(this.identity)
                console.log(this.token)

                localStorage.setItem('token', this.token)
                localStorage.setItem('identity', JSON.stringify(this.identity))

                this._router.navigate(['/home'])

              } else {
                this.status = 'error'
              }
            },
            error => {
              this.status = 'error';
              console.log(error);
            }
          )
        } else {
          this.status = 'error'
        }
      },
      error => {
        this.status = 'error';
        console.log(error);
      }
    )
  }

}
