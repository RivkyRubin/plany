import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { offset } from '@popperjs/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, IApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService<T> {
  actionName: string = '';
  apiURL = environment.apiKey; 
  constructor(private http: HttpClient ) {}
  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // HttpClient API get() method => Fetch employees list
  getAll(): Observable<T[]> {
    return this.http
      .get<IApiResponse<T[]>>(this.apiURL + '/'+this.actionName)
      .pipe(map(res => res.data));
  }
  // HttpClient API get() method => Fetch employee
  getByID(id: any): Observable<T> {
    return this.http
      .get<IApiResponse<T>>(this.apiURL + '/'+this.actionName+'/' + id)
      .pipe(map(res => res.data));
  }
  // HttpClient API post() method => Create employee
  create(entity: T): Observable<T> {
    return this.http
      .post<IApiResponse<T>>(
        this.apiURL + '/'+this.actionName,
        JSON.stringify(entity),
        this.httpOptions
      )
      .pipe(map(res => res.data), catchError(this.handleError));
  }

  update(id: any, entity: T): Observable<T> {
    return this.http
      .put<IApiResponse<T>>(
        this.apiURL + '/'+this.actionName+'/' + id,
        JSON.stringify(entity),
        this.httpOptions
      )
      .pipe(map(res => res.data), catchError(this.handleError));
  }

  delete(id: any) {
    return this.http
      .delete<boolean>(this.apiURL + '/'+this.actionName+'/' + id, this.httpOptions)
      .pipe( tap(data=>{
         if(data==false)
         {
           throw new Error('delete failed');
         }
      }),catchError(this.handleError));
  }
  // Error handling
  handleError(error: any) {
    return throwError(() => {
      return error;
    });
  }
}