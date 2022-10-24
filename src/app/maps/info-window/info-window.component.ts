import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow } from '@angular/google-maps';
import { select } from '@ngrx/store';
import { Subscription, switchMap } from 'rxjs';

import { IFigure } from 'src/app/models/abstract-figure';
import { FigureTypes } from 'src/app/models/figure-types.enum';
import { deleteMarker } from 'src/app/store/actions/markers.actions';
import { deleteRectangle } from 'src/app/store/actions/rectangles.actions';
import { AppState } from 'src/app/store/reducers';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;
  private storeSub: Subscription;
  figureData: IFigure | null;
  userId: number | null;

  constructor(
    private readonly store: AppState
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.pipe(
      select(selectUserId),
      switchMap(userId => {
        this.userId = userId;
        return this.store.select(state => state.infoWindow)
      })
    )
      .subscribe(info => {
        this.figureData = info.data;
        this.openInfoWindow(info.position)
      })
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe()
  }

  // удалить фигуру
  deleteFigure(id: number, authorId: number, type: FigureTypes) {
    if (!this.userId || this.userId !== authorId) return;
    if (type === 'RECTANGLE') {
      this.store.dispatch(deleteRectangle({ id, sendToServer: true }))
    } else if (type === 'MARKER') {
      this.store.dispatch(deleteMarker({ id, sendToServer: true }))
    }
    this.infoWindow?.close()
  }

  // открытие окна с информацией о фигуре
  private openInfoWindow(position: google.maps.LatLngLiteral) {
    if (this.infoWindow) {
      this.infoWindow.options = {
        position: position
      };
      this.infoWindow.open()
    }
  }

}
