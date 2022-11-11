import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

  public selectedFile: any;
  public page_title: string;
  public identity: any;
  public token: any;
  public post: any;
  public categories: any;
  public status: any;
  public froalaOptions: Object = {
    charCounterCount: true,
    language:'es',
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
    this.page_title = 'Crear una entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getCategories();
    this.post = new Post(1, this.identity.sub, 1, '', '', '', null);
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

  cargarImagen(event:any){
    console.log(event.target.files[0]);
    this.selectedFile=<File>event.target.files[0];
     }


  onSubmit(form:any){

    this._postService.upload(this.token, this.selectedFile).subscribe(
      response=>{
        if(response.status=='success'){
          console.log(response);
          this.post.image = response.image;

          this._postService.create(this.token, this.post).subscribe(
            response => {
              if(response.status == 'success'){
                this.post = response.post;
                this.status = 'success';
                this._router.navigate(['/home']);
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
      },
      error=>{
        console.log(<any>error);
      }
    );
    
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
