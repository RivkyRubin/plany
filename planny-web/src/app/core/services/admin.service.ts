import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry, catchError } from 'rxjs';
import { IApiResponse } from '../models/apiResponse.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  updateDatabase() {
    return this.http.get<IApiResponse<boolean>>(`${environment.apiKey}/admin/UpdateDatabase`, ).pipe(map(res => res.data),retry(1));;
  }
}
