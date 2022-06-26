import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API: string = 'https://localhost:44354';

@Injectable()
export class ChatbotService {
  constructor(private http: HttpClient) {}

  // public getInitMessage(): Observable<any> {
  //   return this.http.get(`${API}/introMessage`);
  // }

  // public getSelections(): Observable<any> {
  //   return this.http.get(`${API}/selectedQuestions`);
  // }

  public getResponse(str: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('text', str);
    
    return this.http.get(API + '/v1/Bot/ParseText', {params: params})
  }
}
