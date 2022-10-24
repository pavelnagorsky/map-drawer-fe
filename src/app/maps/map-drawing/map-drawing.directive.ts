import { Directive, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MapEventManager } from '@angular/google-maps';
import { Subscription, switchMap } from 'rxjs';

import { IFigureAuthor } from 'src/app/models/abstract-figure';
import { FigureTypes } from 'src/app/models/figure-types.enum';
import { ICreateMarkerDto } from 'src/app/models/marker.model';
import { ICreateRectangleDto } from 'src/app/models/rectangle.model';
import { addMarkerStart } from 'src/app/store/actions/markers.actions';
import { addRectangleStart } from 'src/app/store/actions/rectangles.actions';
import { AppState } from 'src/app/store/reducers';
import { ControlsState } from 'src/app/store/reducers/controls.reducer';
import { selectUserData } from 'src/app/store/selectors/auth.selectors';
import { GoogleMapsService } from '../google-maps.service';

@Directive({
  selector: '[appMapDrawing]'
})
export class MapDrawingDirective implements OnInit, OnDestroy {
  constructor(
    private readonly store: AppState,
    private readonly mapsService: GoogleMapsService,
    private readonly _ngZone: NgZone
  ) { }

  // экземпляр класса, управляющего подписками на события
  private readonly _eventManager: MapEventManager = new MapEventManager(this._ngZone);

  private eventSub: Subscription;
  private drawingManager?: google.maps.drawing.DrawingManager;
  private figureControls: ControlsState;
  private userData: IFigureAuthor | null = null;
  private map: google.maps.Map | null = null;

  ngOnInit(): void {
    // получить объект карты
    this.eventSub = this.mapsService.mapSubject.pipe(
      switchMap(map => {
        if (map && !this.map) this.map = map;
        // получить данные о настройках рисования
        return this.store.select(state => state.controls)
      }),
      switchMap(controls => {
        this.figureControls = controls;
        // получить данные о текущем пользователе
        return this.store.select(selectUserData)
      }),
      switchMap(userData => {
        this.userData = userData;
        // включить или выключить режим рисования фигур
        this.handleDrawingMode()
        // подписка на событие добавления фигуры
        return this._eventManager
          .getLazyEmitter<google.maps.drawing.OverlayCompleteEvent>('overlaycomplete')
      })
    ).subscribe(drawing => {
      // создание соответсвующей фигуры
      if ( drawing.overlay instanceof google.maps.Rectangle ) {
        const bounds = drawing.overlay.getBounds()?.toJSON();
        this.saveRectangle(bounds);
      } else if ( drawing.overlay instanceof google.maps.Marker ) {
        const position = drawing.overlay.getPosition()?.toJSON();
        this.saveMarker(position)
      }
      // убираем нарисованные фигуры, так как они будут заменены фигурами с сервера
      drawing.overlay?.setMap(null);
    })
  }

  ngOnDestroy(): void {
    this._eventManager.destroy()
    this.eventSub.unsubscribe()
  }

  // [сохранение маркера]
  private saveMarker(position?: google.maps.LatLngLiteral) {
    if (!this.userData || !position) return;
    const markerDto: ICreateMarkerDto = {
      author: this.userData,
      position: position,
      title: this.figureControls.infoControl.title,
      description: this.figureControls.infoControl.description,
      url: this.figureControls.markerControl.url
    };
    this.store.dispatch(addMarkerStart({
      markerDto
    }))
  }

  // [сохранение прямоугольника]
  private saveRectangle(bounds?: google.maps.LatLngBoundsLiteral) {
    if (!this.userData || !bounds) return;
    const rectangleDto: ICreateRectangleDto = {
      author: this.userData,
      bounds: bounds,
      options: this.figureControls.rectangleControl,
      title: this.figureControls.infoControl.title,
      description: this.figureControls.infoControl.description
    };
    this.store.dispatch(addRectangleStart({
      rectangleDto
    }))
  }

  // создание объекта рисовальщика
  private initDrawing() {
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
    });
    drawingManager.setMap(null);  
    return drawingManager;
  }

  // получить тип фигуры для рисования
  private getOverlayType() {
    if (!this.figureControls.enabled) return null;
    if (this.figureControls.currentType === FigureTypes.MARKER) {
      return google.maps.drawing.OverlayType.MARKER
    } else {
      return google.maps.drawing.OverlayType.RECTANGLE
    }
  }

  // в зависимости от данных из стейта - включить или выключить режим рисования
  private handleDrawingMode() {
    // первая инициализация
    if (
      this.map && 
      this.userData &&
      this.figureControls &&
      !this.drawingManager
    ) {
      this.drawingManager = this.initDrawing();
      this._eventManager.setTarget(this.drawingManager)
    }

    if (!this.drawingManager || !this.map) return;

    // выключить режим рисования
    if (!this.figureControls.enabled) {
      this.drawingManager.setDrawingMode(null);
      this.drawingManager.setMap(null);
    } else {
      // включить режим рисования и синхронизировать со стэйтом
      this.drawingManager.setMap(this.map);
      this.drawingManager.setDrawingMode(this.getOverlayType())
      this.drawingManager.setOptions({
        markerOptions: {
          icon: this.figureControls.markerControl.url
        },
        rectangleOptions: {
          fillColor: this.figureControls.rectangleControl.fillColor,
          fillOpacity: this.figureControls.rectangleControl.fillOpacity,
          strokeColor: this.figureControls.rectangleControl.strokeColor
        }
      })
    }
  }
}