import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/models/video';

@Component({
  selector: 'video-new',
  templateUrl: './video-new.component.html',
  styleUrls: ['./video-new.component.css'],
  providers: [UserService, VideoService]
})
export class VideoNewComponent implements OnInit {

  public page_title: string
  public identity
  public token
  public video: Video
  public status: string

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _videoService: VideoService
  ) {
    this.page_title = "Guardar un nuevo video favorito"
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken()
    this.video = new Video(1, this.identity.sub, '', '', '', '', null, null)
    this.status = ""
  }

  ngOnInit(): void {
    
  }

  onSubmit(form: any){
    this._videoService.create(this.token, this.video).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = 'success'
          this._router.navigate(['/home'])
        }
      },
      error => {
        this.status = 'error'
        console.log(error)
      }
    )
  }

}
