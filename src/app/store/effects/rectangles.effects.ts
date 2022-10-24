import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";

import { RectangleSerialize } from "src/app/maps/rectangle/serialization/rectangle.serialize";
import { FigureTypes } from "src/app/models/figure-types.enum";
import { ICreateRectangleDto, IUpdateRectangleDto, Rectangle } from "src/app/models/rectangle.model";
import * as RectanglesActions from '../actions/rectangles.actions';

@Injectable()
export class RectanglesEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly rectangleSerializer: RectangleSerialize
  ) {}

  // добавить новый прямоугольник на карту
  performAddRectangle = createEffect(() => this.actions$
    .pipe(
      ofType(RectanglesActions.addRectangleStart),
      exhaustMap( ({ rectangleDto }) => this.handleAddRectangle(rectangleDto))
    ), { dispatch: false }
  )

  // получить все прямоугольники
  performFetch = createEffect(() => this.actions$
    .pipe(
      ofType(RectanglesActions.fetchStart),
      exhaustMap(() => this.handleFetch())
    )
  )

  // обновить границы прямоугольника
  performUpdate = createEffect(() => this.actions$
    .pipe(
      ofType(RectanglesActions.updateRectangle),
      switchMap( ({ rectangle, sendToServer }) => this.handleUpdateRectangle(rectangle, sendToServer) )
    ), { dispatch: false }
  )

  // удалить прямоугольник
  performDelete = createEffect(() => this.actions$
    .pipe(
      ofType(RectanglesActions.deleteRectangle),
      exhaustMap( ({ id, sendToServer }) => this.handleDelete(id, sendToServer) )
    ), { dispatch: false }
  )


  private handleFetch() {
    return this.http.get<{ rectangles: IUpdateRectangleDto[] }>(
      '/map/rectangles'
    ).pipe(
      map(response => {
        const rectangles = response.rectangles.map(rectDto => {
          return new Rectangle(rectDto)
        });
        return RectanglesActions.fetchSuccess({ rectangles })
      }),
      catchError((err: HttpErrorResponse) => {
        return of(RectanglesActions.fetchFail())
      })
    )
  }

  private handleAddRectangle(rectangleDto: ICreateRectangleDto) {
    const serializedRectangle = this.rectangleSerializer.serializeCreateRectangle(rectangleDto);
    return this.http.post<{ rectangle: IUpdateRectangleDto }>(
      '/map/rectangles',
      serializedRectangle
    ).pipe(
      // не диспатчим действия - они придут по сокетам
      map(response => {
        return of(true)
      }),
      catchError((err: HttpErrorResponse) => {
        return of(false)
      })
    )
  }

  private handleUpdateRectangle(rectangle: Rectangle, sendToServer: boolean) {
    if (!sendToServer) return of(false);
    const serializedRectangle = this.rectangleSerializer.serializeUpdateRectangle(rectangle);
    return this.http.patch<{ rectangle: IUpdateRectangleDto }>(
      '/map/rectangles/' + rectangle.getId(),
      {
        ...serializedRectangle,
        figureType: FigureTypes.RECTANGLE
      }
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
      '/map/rectangles/' + id,
      {
        body: { 
          figureType: FigureTypes.RECTANGLE,
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