import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public api_url: string
  public identity: any
  public token: any

  constructor(
    public _http: HttpClient
  ) {
    this.api_url = environment.API_URL;
  }

  register(user:any):Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.api_url+'register', params, {headers:headers});
  }

  login(user: any, gettoken : any = null):Observable<any>{
    if(gettoken != null){
      user.gettoken = 'true';
    }

    let json = JSON.stringify(user);
    let params = 'json='+json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(this.api_url+'login', params, {headers:headers});
  }

  update(token: any, user: any):Observable<any>{
    let json = JSON.stringify(user);
    let params = 'json='+json;

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.put(this.api_url+'user/update', params, {headers:headers});
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity') || '{}');

    if(identity && identity != 'undefined'){
      this.identity = identity
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');

    if(token && token != 'undefined'){
      this.token = token
    } else {
      this.token = null;
    }

    return this.token;
  }
}
