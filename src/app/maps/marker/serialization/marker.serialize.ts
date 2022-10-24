import { Injectable } from "@angular/core";

import { ICreateMarkerDto } from "src/app/models/marker.model";

interface ISerializedCreateMarker {
  authorId: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  url?: string;
}

@Injectable()
export class MarkerSerialize {
  serializeCreateMarker(markerData: ICreateMarkerDto)
    : ISerializedCreateMarker
  {
    return {
      authorId: markerData.author.id,
      title: markerData.title,
      description: markerData.description,
      lat: markerData.position.lat,
      lng: markerData.position.lng,
      url: markerData.url
    }
  }
}