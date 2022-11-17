import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { VideoService } from 'src/app/services/video.service';
import { Video } from 'src/app/models/video';

@Component({
  selector: 'app-video-edit',
  templateUrl: '../video-new/video-new.component.html',
  styleUrls: ['./video-edit.component.css'],
  providers: [UserService, VideoService]
})
export class VideoEditComponent implements OnInit {

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
    this.page_title = "Modificar este video"
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken()
    this.video = new Video(1, this.identity.sub, '', '', '', '', null, null)
    this.status = ""
  }

  ngOnInit(): void {
    this.getVideo()
  }

  getVideo(){
    this._route.params.subscribe(params => {
      let id = +params['id']

      this._videoService.getVideo(this.token, id).subscribe(
        response => {
          if(response.status == 'success'){
            this.video = response.video
          } else {
            this._router.navigate(['/home'])
          }
        }
      )
    })
  }

  onSubmit(form: any){
    this._videoService.update(this.token, this.video, this.video.id).subscribe(
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
