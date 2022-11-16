import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title: string 
  public user: User
  public status: string
  public identity: any
  public token: any

  constructor(
    private _userService: UserService
  ) {
    this.page_title = "Ajustes de usuario"
    this.identity = _userService.getIdentity()
    this.token = _userService.getToken()
    this.user = new User(
      this.identity.sub, this.identity.name,
      this.identity.surname, this.identity.email, '', 'ROLE_USER', '')
    this.status = ""
  }

  ngOnInit(): void {
  }

  onSubmit(form: any){
    this._userService.update(this.token, this.user).subscribe(
      response => {
        if(response && response.status == 'success'){
          this.status = "success"

          this.identity = response.user
          this.user = response.user
          localStorage.setItem('identity', JSON.stringify(this.identity))
          
        }else{
          this.status = "error"
        }
      },
      error => {
        this.status = "error"
        console.log(error)
      }
    )
  }

}
