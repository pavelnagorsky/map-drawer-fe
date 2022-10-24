import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapRectangle } from '@angular/google-maps';
import { Subscription, switchMap } from 'rxjs';

import { Rectangle } from 'src/app/models/rectangle.model';
import { updateRectangle } from 'src/app/store/actions/rectangles.actions';
import { AppState } from 'src/app/store/reducers';
import { selectRectangles } from 'src/app/store/selectors/rectangles.selectors';
import { InfoWindowService } from '../info-window/info-window.service';
import { setInfoWindow } from 'src/app/store/actions/info-window.actions';
import { IFigure } from 'src/app/models/abstract-figure';
import { select } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';
import { DataConsumerService } from 'src/app/socket/data-consumer.service';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss']
})
export class RectangleComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  private socketSubs: Subscription[] = [];
  private userId: number | null;
  rectangles: Rectangle[] = [];

  constructor(
    private readonly store: AppState,
    private readonly infoWindowService: InfoWindowService,
    private readonly dataFromSocket: DataConsumerService
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.pipe(
      select(selectUserId),
      switchMap(userId => {
        this.userId = userId;
        return this.store.select(selectRectangles)
      })
    )
      .subscribe(rectangles => {
        this.rectangles = rectangles
      });
    // подписка на обновление прямоугольников через сокеты
    this.socketSubs.push(
      this.dataFromSocket.subscribeAddRectangle().subscribe(),
      this.dataFromSocket.subscribeUpdateRectangle().subscribe(),
      this.dataFromSocket.subscribeDeleteRectangle().subscribe()
    )
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.socketSubs.forEach(sub => sub.unsubscribe())
  }

  onViewInfo(rectEl: MapRectangle, index: number) {
    const position = this.infoWindowService.getWindowPosition(rectEl);
    const rectangle = this.rectangles[index];
    const windowInfoData: IFigure = {
      id: rectangle.getId(),
      author: rectangle.getAuthor(),
      createdAt: rectangle.getCreatedAt(),
      title: rectangle.getTitle(),
      description: rectangle.getDescription(),
      type: rectangle.type
    }
    this.store.dispatch(setInfoWindow({
      position: position,
      data: windowInfoData
    }))
  }

  // включить или выключить режим редактирования прямоугольника
  toggleRectEdit(index: number) {
    // редактировать может только создатель фигуры
    if (!this.userId || this.userId !== this.rectangles[index].getAuthor().id) return;
    // проверяем, нужно включить или выключить режим изменения
    let setToEditable = this.rectangles[index].getEditable() 
      ? false
      : true;
    const rectangleDto = this.rectangles[index].getAll();
    const updatedRectangle = new Rectangle(rectangleDto);
    updatedRectangle.setEditable(setToEditable);
    this.store.dispatch(updateRectangle({
      rectangle: updatedRectangle,
      sendToServer: false
    }))
  }

  // обновление координат
  onChangeRectangleBounds(rectEl: MapRectangle, index: number) {
    // редактировать может только создатель фигуры
    if (!this.userId || this.userId !== this.rectangles[index].getAuthor().id) return;
    // сравниваем старые и новые координаты, и обновляем их
    const oldRect = this.rectangles[index];
    const oldBounds = oldRect.getBounds();
    const newBounds = rectEl.getBounds()?.toJSON();
    if (
      newBounds &&
      (
        oldBounds.east !== newBounds.east ||
        oldBounds.west !== newBounds.west ||
        oldBounds.south !== newBounds.south ||
        oldBounds.north !== newBounds.north 
      )
    ) {
      const rectangleDto = oldRect.getAll();
      const updatedRectangle = new Rectangle(rectangleDto);
      updatedRectangle.setBounds(newBounds);
      updatedRectangle.setEditable(false);
      this.store.dispatch(updateRectangle({
        rectangle: updatedRectangle,
        sendToServer: true
      }))
    }
  }

}