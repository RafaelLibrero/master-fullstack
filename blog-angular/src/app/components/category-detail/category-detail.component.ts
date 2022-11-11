import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, PostService, UserService]
})
export class CategoryDetailComponent implements OnInit {

  public category: any;
  public posts: any;
  public url: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.url = environment.API_URL;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPostsByCategory();
  }

  getPostsByCategory(){
    this._route.params.subscribe(params => {
      let id = +params['id'];

      this._categoryService.getCategory(id).subscribe(
        response => {
          if(response.status == 'success'){
            this.category = response.category;

            this._categoryService.getCategoryPosts(id).subscribe(
              response => {
                if(response.status == 'success'){
                  this.posts = response.posts;
                } else {
                  this._router.navigate(['/error']);
                }
              },
              error => {
                console.log(error);
              }
            )
          } else {
            this._router.navigate(['/error']);
          }
        },
        error => {
          console.log(error);
        }
      )
    })
  }

  deletePost(id: any){
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getPostsByCategory();
      },
      error => {
        console.log(error);
      }
    )
  }

}
