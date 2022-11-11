import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public url: string;

  constructor(
    private _http: HttpClient
  ){
    this.url = environment.API_URL;
  }

  create(token: any, category: any):Observable<any>{
    let json = JSON.stringify(category);
    let params = "json="+json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);

    return this._http.post(this.url + 'category', params, {headers:headers});
  }

  getCategories():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'category', {headers: headers});
  }

  getCategory(id: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'category/' +id, {headers: headers});
  }

  getCategoryPosts(id: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'post/category/' +id, {headers: headers});
  }
}
