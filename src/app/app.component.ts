import { Component, OnInit } from '@angular/core';

import { SocketService } from './socket/socket.service';
import { autoLogin } from './store/actions/auth.actions';
import { AppState } from './store/reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly store: AppState,
    private readonly socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(autoLogin())
    // подключить сокет соединение
    this.socketService.connect()
  }
}
