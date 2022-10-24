import { Injectable } from "@angular/core";
import { tap } from "rxjs";

import { IUpdateMarkerDto, Marker } from "../models/marker.model";
import { IUpdateRectangleDto, Rectangle } from "../models/rectangle.model";
import { addMarkerSuccess, deleteMarker } from "../store/actions/markers.actions";
import { addRectangleSuccess, deleteRectangle, updateRectangle } from "../store/actions/rectangles.actions";
import { AppState } from "../store/reducers";
import { SocketMessages } from "./socket-messages.enum";
import { SocketService } from "./socket.service";

@Injectable()
export class DataConsumerService {
  constructor(
    private readonly socketService: SocketService,
    private readonly store: AppState
  ) {}

  subscribeAddRectangle() {
    return this.socketService.subscribeToMessage<{ rectangle: IUpdateRectangleDto }>
    (SocketMessages.NEW_RECTANGLE)
    .pipe(
      tap(data => {
        // добавляем новый прямоугольник в стэйт
        const rectangle = new Rectangle(data.rectangle);
        this.store.dispatch(addRectangleSuccess({ rectangle }))
      })
    )
  }

  subscribeUpdateRectangle() {
    return this.socketService.subscribeToMessage<{ rectangle: IUpdateRectangleDto }>
    (SocketMessages.UPDATE_RECTANGLE)
    .pipe(
      tap(data => {
        // обновляем прямоугольник в стэйте
        const rectangle = new Rectangle(data.rectangle);
        this.store.dispatch(updateRectangle({ rectangle, sendToServer: false }))
      })
    )
  }

  subscribeDeleteRectangle() {
    return this.socketService.subscribeToMessage<{ id: number }>
    (SocketMessages.DELETE_RECTANGLE)
    .pipe(
      tap(data => {
        // удаляем прямоугольник из стэйта
        this.store.dispatch(deleteRectangle({ id: data.id, sendToServer: false }))
      })
    )
  }

  subscribeAddMarker() {
    return this.socketService.subscribeToMessage<{ marker: IUpdateMarkerDto }>
    (SocketMessages.NEW_MARKER)
    .pipe(
      tap(data => {
        // добавляем новый маркер в стэйт
        const marker = new Marker(data.marker)
        this.store.dispatch(addMarkerSuccess({ marker }));
      })
    )
  }

  subscribeDeleteMarker() {
    return this.socketService.subscribeToMessage<{ id: number }>
    (SocketMessages.DELETE_MARKER)
    .pipe(
      tap(data => {
        // удаляем маркер из стэйта
        this.store.dispatch(deleteMarker({ id: data.id, sendToServer: false }));
      })
    )
  }
}