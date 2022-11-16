import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video } from '../models/video';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  public api_url: string

  constructor(
    public _http: HttpClient
  ) {
    this.api_url = environment.API_URL;
  }

  create(token: any, video: any):Observable<any>{
    let json = JSON.stringify(video);
    let params = 'json='+json;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.post(this.api_url+'video/new', params, {headers:headers});
  }

  getVideos(token: any, page: any):Observable<any>{
    if(!page){
      page = 1
    }
    
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.get(this.api_url+'video?page='+page, {headers:headers});
  }

  getVideo(token: any, id: any):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.get(this.api_url+'video/'+id, {headers:headers});
  }

  update(token: any, video: any, id: any):Observable<any>{
    let json = JSON.stringify(video);
    let params = 'json='+json;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.put(this.api_url+'video/'+id, params, {headers:headers});
  }

  delete(token: any, id: any):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.delete(this.api_url+'video/'+id, {headers:headers});
  }
  
}
