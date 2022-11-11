import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {

  public page_title: string;
  public identity: any;
  public token: any;
  public post: any;
  public categories: any;
  public status: any;
  public froalaOptions: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline'],
    toolbarButtonsXS: ['bold', 'italic', 'underline'],
    toolbarButtonsSM: ['bold', 'italic', 'underline'],
    toolbarButtonsMD: ['bold', 'italic', 'underline'],
  };

  public files: File[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  ) {
    this.page_title = 'Editar una entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getCategories();
    this.post = new Post(1, this.identity.sub, 1, '', '', '', null);
    this.getPost();
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

  getPost(){
    this._route.params.subscribe(params => {
      let id = +params['id'];
      console.log(id);

      this._postService.getPost(id).subscribe(
        response => {
          if(response.status == 'success'){
            this.post = response.post;

            if(this.post.user_id != this.identity.sub){
              this._router.navigate(['/error']);
            }
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

  onSubmit(form:any){
    this._postService.update(this.token, this.post, this.post.id).subscribe(
      response => {
        if(response.status == 'success'){
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['/entrada', this.post.id]);
          form.reset();
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    )
  }

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

}
