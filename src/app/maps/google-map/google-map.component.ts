import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@ngrx/store';
import { Observable, Subscription, switchMap } from 'rxjs';

import { GoogleMapsService } from 'src/app/maps/google-maps.service';
import { IFigureAuthor } from 'src/app/models/abstract-figure';
import { 
  fetchStart as fetchMarkerStart
} from 'src/app/store/actions/markers.actions';
import { 
  fetchStart as fetchRectanglesStart
} from 'src/app/store/actions/rectangles.actions';
import { AppState } from 'src/app/store/reducers';
import { selectUserData } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit, OnDestroy {
  constructor(
    private readonly googleMapsService: GoogleMapsService,
    private readonly store: AppState,
    private readonly route: ActivatedRoute
  ) {}

  apiLoaded$: Observable<boolean>;
  private storeSub: Subscription;

  // данные о пользователе
  private userData: IFigureAuthor | null;

  // конфигурация карты
  editMode: boolean;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions;

  ngOnInit() {
    // загрузка google api
    this.apiLoaded$ = this.googleMapsService.load();
    // загрузить фигуры
    this.dispatchFigures();
    // получить настройки карты
    this.configureMap();
    // получить геолокацию пользователя
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });
    // получаем данные о настройках фигуры и авторе для нанесения на карту
    this.storeSub = this.store.pipe(
      select(selectUserData),
      switchMap(userData => {
        // получить данные о пользователе
        this.userData = userData;
        // получить query param 'edit'
        return this.route.queryParams
      })
    )
      .subscribe(queryParams => {
        // настройка режима создания фигур
        this.editMode = (queryParams['edit'] === "true" && this.userData) ? true : false;
      })
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe()
  }

  // получить объект карты и передать в сервис для дальнейшего рисования
  onMapInitialized(map: google.maps.Map) {
    if (this.userData) this.googleMapsService.setMapObj(map)
  }

  // загрузить с сервера фигуры
  private dispatchFigures() {
    this.store.dispatch(fetchRectanglesStart())
    this.store.dispatch(fetchMarkerStart())
  }

  // настроить карту
  private configureMap() {
    this.options = this.googleMapsService.getMapOptions();
    this.center = this.googleMapsService.getCenter();
  }
}