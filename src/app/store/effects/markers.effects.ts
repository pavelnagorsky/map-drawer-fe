import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";

import { MarkerSerialize } from "src/app/maps/marker/serialization/marker.serialize";
import { FigureTypes } from "src/app/models/figure-types.enum";
import { ICreateMarkerDto, IUpdateMarkerDto, Marker } from "src/app/models/marker.model";
import * as MarkersActions from '../actions/markers.actions';

@Injectable()
export class MarkersEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly serializer: MarkerSerialize
  ) {}

  // добавить новый маркер на карту
  performAddMarker = createEffect(() => this.actions$
    .pipe(
      ofType(MarkersActions.addMarkerStart),
      exhaustMap( ({ markerDto }) => this.handleAddMarker(markerDto))
    ), { dispatch: false }
  )

  // получить все маркеры
  performFetch = createEffect(() => this.actions$
      .pipe(
        ofType(MarkersActions.fetchStart),
        exhaustMap(() => this.handleFetch())
      )
  )

  // удалить маркер
  performDelete = createEffect(() => this.actions$
    .pipe(
      ofType(MarkersActions.deleteMarker),
      exhaustMap( ({ id, sendToServer }) => this.handleDelete(id, sendToServer) )
    ), { dispatch: false }
  )

  private handleFetch() {
    return this.http.get<{ markers: IUpdateMarkerDto[] }>(
      '/map/markers'
    ).pipe(
      map(response => {
        const markers = response.markers.map(markerDto => {
          return new Marker(markerDto)
        });
        return MarkersActions.fetchSuccess({ markers })
      }),
      catchError((err: HttpErrorResponse) => {
        return of(MarkersActions.fetchFail())
      })
    )
  }

  private handleAddMarker(markerDto: ICreateMarkerDto) {
    const serializedMarker = this.serializer.serializeCreateMarker(markerDto);
    return this.http.post<{ marker: IUpdateMarkerDto }>(
      '/map/markers',
      serializedMarker
    ).pipe(
      // не диспатчим действия - они придут по сокетам
      map(res => {
        return of(true)
      }),
      catchError((err: HttpErrorResponse) => {
        return of(false)
      })
    )
  }

  private handleDelete(id: number, sendToServer: boolean) {
    if (!sendToServer) return of(false);
    return this.http.delete<{ id: number }>(
      '/map/markers/' + id,
      {
        body: { 
          figureType: FigureTypes.MARKER,
          id: id
        }
      }
    ).pipe(
      map(res => {
        return of(true)
      }),
      catchError((err: HttpErrorResponse) => {
        return of(false)
      })
    )
  }
}