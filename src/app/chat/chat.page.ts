import { Component, OnInit, ViewChild } from '@angular/core';
import io from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { IonContent } from '@ionic/angular';
import { MessageService } from '../services/message.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  messagesArray = [];
  socket = io(environment.baseUrl);
  @ViewChild('content', { static: true }) content: IonContent;

  constructor(
    public msgService: MessageService,
    public activeparms: ActivatedRoute
  ) {
    activeparms.params.subscribe((rsp: any) => {
      this.receiverId = parseInt(rsp.id);
      this.receiverName = rsp.name;
      this.senderId = JSON.parse(localStorage.getItem('user')).id;
      this.senderName = JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
      this.passengerP = this.senderName.charAt(0);
      this.driverD = this.receiverName.charAt(0);
      this.GetMessages();
      this.socket.on('listenchat' + this.senderId, (data) => {
        console.log('Messages Refresher', data);
        this.messagesArray.push(data);
        this.scrollToBottom();
      });
    })
  }
  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 300);
  }
  receiverId = 0;
  receiverName = '';
  senderId = 0;
  senderName = '';
  passengerP = '';
  driverD = '';
  message: any;
  ngOnInit() {
  }
  ngAfterVthiewInit() {
    const params = {
      room1: this.senderName,
      room2: this.receiverName
    };
    this.socket.emit('join_chat', params);
  }
  GetMessages() {
    this.msgService.GetAllMessages(this.senderId, this.receiverId).subscribe(data => {
      if (data !== 'No conversation is started yet!') {
        this.messagesArray = data;
        console.log(this.messagesArray);
        this.scrollToBottom()
      }
    });
  }
  SendMessage() {
    if (this.message) {
      let data = {
        senderId: this.senderId,
        receiverId: this.receiverId,
        messageBody: this.message,
        receiverName: this.receiverName,
        senderName: this.senderName,
      }
      this.message = '';
      this.msgService
        .SendMessage(data)
        .subscribe(resp => {
          this.messagesArray.push(data);
          this.socket.emit('refresh', data);
          this.scrollToBottom()
        });
    }
  }
}
