import { Injectable } from "@angular/core";
import { MapMarker, MapRectangle } from "@angular/google-maps";

@Injectable()
export class InfoWindowService {
  // возвращает координату для окна с информацией
  getWindowPosition(figure: MapMarker | MapRectangle): google.maps.LatLngLiteral {
    if (figure instanceof MapRectangle) {
      // получаем координату угла прямоугольника
      const northEastCoordinate = {...figure.getBounds()?.getNorthEast().toJSON()} as google.maps.LatLngLiteral;
      const southWestCoordinate = {...figure.getBounds()?.getSouthWest().toJSON()} as google.maps.LatLngLiteral;
      // получаем координату для окна с информацией
      const coordinateForWindow = {
        lat: northEastCoordinate.lat,
        lng: (northEastCoordinate.lng + southWestCoordinate.lng) / 2
      } as google.maps.LatLngLiteral;
      // возвращаем положение окна по координатам прямоугольника
      return coordinateForWindow
    } else {
      // возвращаем положение окна по координате маркера
      return figure.getPosition()?.toJSON() as google.maps.LatLngLiteral
    }
  }
}