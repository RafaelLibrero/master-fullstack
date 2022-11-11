import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})

export class UserEditComponent implements OnInit {
  
  public selectedFile: any;
  public url: string;
  public page_title: string;
  public user: User;
  public identity: any;
  public token: any;
  public status: any;
  public froalaContent: string;
  public froalaOptions: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline'],
    toolbarButtonsXS: ['bold', 'italic', 'underline'],
    toolbarButtonsSM: ['bold', 'italic', 'underline'],
    toolbarButtonsMD: ['bold', 'italic', 'underline'],
  };
  public formData: any;
  
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.url = environment.API_URL;
    this.page_title = 'Ajustes de usuario';
    this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email, '',
      this.identity.description,
      this.identity.image);
    this.froalaContent = this.user.description;
    
   }

  ngOnInit(): void {
    console.log(this.user);
  }

  cargarImagen(event:any){
    console.log(event.target.files[0]);
    this.selectedFile=<File>event.target.files[0];
     }

  onSubmit(form: any){

    this._userService.upload(this.token, this.selectedFile).subscribe(
      response=>{
         if(response.status=='success'){
           console.log(response);
           this.user.image = response.image;

           this._userService.update(this.token, this.user).subscribe(
            response => {
              if(response){
                console.log(response);
                this.status = 'success';
      
                if(response.changes.name){
                  this.user.name = response.changes.name;
                }
      
                if(response.changes.surname){
                  this.user.surname = response.changes.surname;
                }
      
                if(response.changes.email){
                  this.user.email = response.changes.email;
                }
      
                if(response.changes.description){
                  this.user.description = response.changes.description;
                }
      
                if(response.changes.image){
                  
                }
      
                this.identity = this.user;
                localStorage.setItem('identity', JSON.stringify(this.user));
      
                this._router.navigate(['home']);
              }
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );
         }
      },
      error=>{
        this.status = 'error'
        console.log(<any>error);
      }
    );

    
  }
}

