import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  socket;
  constructor() {
    this.socket = io(environment.baseUrl);
  }
}
