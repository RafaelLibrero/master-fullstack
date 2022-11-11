import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url: string;
  public headers: any;
  public token: any;
  public identity :any;

  constructor(
    public _http: HttpClient
  ) { 
    this.url = environment.API_URL;
    this.headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  }

  register(user:any): Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;

    return this._http.post(this.url+'register', params, {headers: this.headers});
  }

  login({ user, gettoken = null }: { user: any; gettoken?: any; }): Observable<any>{
      if(gettoken != null){
        user.gettoken = 'true';
      }

      let json = JSON.stringify(user);
      let params = 'json='+json;

      return this._http.post(this.url+'login', params, {headers:this.headers});
  }

  update(token: any, user: any): Observable<any>{
    user.description = environment.htmlEntities(user.description);
    let json = JSON.stringify(user);
    let params = "json="+json;

    let headers = this.headers.set('Authorization', token);

    return this._http.put(this.url + 'user/update', params, {headers: headers});
  }

  upload(token: any, file: any): Observable<any>{
    const formData = new FormData(); 

    let headers = new HttpHeaders()
      .set('Authorization', token);
    formData.append('file0', file, file.name);
     
    return this._http.post(this.url + 'user/upload', formData, {headers: headers});
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity')|| '{}');

    if(identity && identity != "undefined"){
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');

    if(token && token != 'undefined'){
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

  getUserPosts(id: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'post/user/' +id, {headers: headers});
  }

  getUser(id: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'user/detail/' +id, {headers: headers});
  }

}
