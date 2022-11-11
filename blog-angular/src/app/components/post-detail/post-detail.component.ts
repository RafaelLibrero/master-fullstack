import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService]
})
export class PostDetailComponent implements OnInit {

  public post: any;
  public url: string;

  constructor(
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.url = environment.API_URL;
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(){
    this._route.params.subscribe(params => {
      let id = +params['id'];
      console.log(id);

      this._postService.getPost(id).subscribe(
        response => {
          if(response.status == 'success'){
            this.post = response.post;
            console.log(this.post);
          } else {
            this._router.navigate(['/error']);
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/error']);
        }
      );
    });
  }

}
