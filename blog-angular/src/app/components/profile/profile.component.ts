import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {

  public url: string;
  public posts: Array<Post> = [];
  public user: any;
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.url = environment.API_URL;
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity();
  }

  ngOnInit(): void {

    this.getProfile();
  }

  getProfile(){
    this._route.params.subscribe(params => {
      let userId = +params['id'];
      this.getUser(userId);
      this.getUserPosts(userId);
    })
  }

  getUser(userId: any){
    this._userService.getUser(userId).subscribe(
      response => {
        if(response.status == 'success'){
          this.user = response.user;

          console.log(this.user);

        }

      },
      error => {
        console.log(error);  
      }
    )
  }

  getUserPosts(userId: any){
    this._userService.getUserPosts(userId).subscribe(
      response => {
        if(response.status == 'success'){
          this.posts = response.posts;

          console.log(this.posts);

        }

      },
      error => {
        console.log(error);  
      }
    )
  }

  deletePost(id: any){
    this._postService.delete(this.token, id).subscribe(
      response => {
        this.getProfile();
      },
      error => {
        console.log(error);
      }
    )
  }

}
