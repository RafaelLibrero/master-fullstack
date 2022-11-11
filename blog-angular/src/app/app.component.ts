import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck{
  public title = 'Blog de Angular';
  public identity: any;
  public token: any;
  public url: string;
  public categories: any;

  constructor(
    public _userService: UserService,
    public _categoryService: CategoryService
  ){
    this.loadUser();
    this.url = environment.API_URL;
  }
  ngOnInit(): void {
    this.getCategories();
  }
  ngDoCheck(): void {
    this.loadUser();
  }

  loadUser(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      response => {
        if(response.status == 'success'){
          this.categories = response.categories;
        }
      },
      error => {
        console.log(error);
      }
    )
  }
}
