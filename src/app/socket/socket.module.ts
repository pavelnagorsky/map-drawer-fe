import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';
import { DataConsumerService } from './data-consumer.service';
import { SocketService } from './socket.service';

const config: SocketIoConfig = { 
  url: environment.baseUrl, 
  options: {
    reconnectionAttempts: 7
  } 
};

@NgModule({
  imports: [SocketIoModule.forRoot(config)],
  providers: [SocketService, DataConsumerService]
})
export class SocketModule {}