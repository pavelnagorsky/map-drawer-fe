import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Environment } from '../shared/env';

@Injectable()
export class GoogleMapsService {
  readonly mapSubject = new BehaviorSubject<google.maps.Map | null>(null)

  setMapObj(map: google.maps.Map) {
    this.mapSubject.next(map)
  }

  private loaded = false;

  constructor(
    private readonly httpClient: HttpClient, 
    private readonly envService: Environment
  ) {}

  // загрузить google maps api, если еще не загружены
  load(): Observable<boolean> {
    let url = `https://maps.googleapis.com/maps/api/js?key=${this.envService.googleMapsApi}&libraries=drawing`;
    return !this.loaded
      ? this.httpClient
          .jsonp(url, 'callback')
          .pipe(
            tap(() => (this.loaded = true)),
            map(() => true),
            catchError(() => of(false))
          )
      : of(this.loaded);
  }

  // получить настройку карты
  getMapOptions() {
    return {
      mapTypeId: 'hybrid',
      scrollwheel: false,
      disableDoubleClickZoom: true,
      maxZoom: 15,
      minZoom: 0, //8
      zoom: 12,
      streetViewControl: false
    } as google.maps.MapOptions
  }

  // координаты центра карты, в данном случае Гомель
  getCenter() {
    return {
      lat: 52.42829799303109,
      lng: 30.99760517019167
    } as google.maps.LatLngLiteral
  }
}