import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = environment.API_URL;
  }

  create(token: any, post: any): Observable<any> {
    post.content = environment.htmlEntities(post.content);

    let json = JSON.stringify(post);
    let params = "json=" + json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.post(this.url + 'post', params, { headers: headers });
  }

  getPosts():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'post', {headers: headers});
  }

  getPost(id:number):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'post/' +id, {headers: headers});
  }

  update(token:any, post:any, id:any):Observable<any>{
    post.content = environment.htmlEntities(post.content);

    let json = JSON.stringify(post);
    let params = "json="+json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.put(this.url + 'post/' +id, params, {headers: headers});
  }

  delete(token: any, id: any ){
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

      return this._http.delete(this.url + 'post/' + id, {headers: headers});
  }

  upload(token: any, file: any): Observable<any>{
    const formData = new FormData(); 

    let headers = new HttpHeaders()
      .set('Authorization', token);
    formData.append('file0', file, file.name);
     
    return this._http.post(this.url + 'post/upload', formData, {headers: headers});
  }
  
}
