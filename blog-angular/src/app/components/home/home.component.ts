import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService, UserService]
})
export class HomeComponent implements OnInit {

  public page_title: string;
  public url;
  public posts: Array<Post> = [];
  public identity;
  public token;

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.page_title = 'Inicio';
    this.url = environment.API_URL;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(){
    this._postService.getPosts().subscribe(
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
        this.getPosts();
      },
      error => {
        console.log(error);
      }
    )
  }

}
