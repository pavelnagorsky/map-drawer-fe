import { Injectable } from "@angular/core";

import { ICreateRectangleDto, Rectangle } from "src/app/models/rectangle.model";

interface ISerializedCreateRectangle {
  authorId: number;
  title: string;
  description: string;
  north: number;
  east: number;
  south: number;
  west: number;
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
}

interface ISerializedUpdateRectangle {
  id: number;
  authorId: number;
  north: number;
  east: number;
  south: number;
  west: number;
}

@Injectable()
export class RectangleSerialize {
  serializeCreateRectangle(rectangleData: ICreateRectangleDto)
    : ISerializedCreateRectangle
  {
    return {
      authorId: rectangleData.author.id,
      title: rectangleData.title,
      description: rectangleData.description,
      north: rectangleData.bounds.north,
      south: rectangleData.bounds.south,
      west: rectangleData.bounds.west,
      east: rectangleData.bounds.east,
      fillColor: rectangleData.options.fillColor,
      fillOpacity: rectangleData.options.fillOpacity,
      strokeColor: rectangleData.options.strokeColor
    }
  }

  serializeUpdateRectangle(rectangle: Rectangle)
    : ISerializedUpdateRectangle
  {
    return {
      id: rectangle.getId(),
      authorId: rectangle.getAuthor().id,
      north: rectangle.getBounds().north,
      south: rectangle.getBounds().south,
      west: rectangle.getBounds().west,
      east: rectangle.getBounds().east
    }
  }
}