import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class SocketService {
  constructor(
    private readonly socket: Socket
  ) {}

  // подключиться к сокету
  connect() {
    return this.socket.connect()
  }

  // отправить сообщение по сокету
  emit<T = any>(messageType: string, payload: T) {
    this.socket.emit(messageType, payload);
  }

  // вернуть подписку на сообщение сокета
  subscribeToMessage<T = any>(messageType: string): Observable<T> {
    return this.socket.fromEvent(messageType);
  }
}