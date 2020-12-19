import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
const BASEURL = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  SendMessage(data): Observable<any> {
    return this.http.post(`${BASEURL}chat/sendmessage/${data.senderId}/${data.receiverId}`, data);
  }

  GetAllMessages(senderId, receiverId): Observable<any> {
    return this.http.get(`${BASEURL}chat/getallmessages/${senderId}/${receiverId}`);
  }
}
