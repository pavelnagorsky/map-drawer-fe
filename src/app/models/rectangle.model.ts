import { AbstractFigure, IFigureAuthor } from "./abstract-figure";
import { FigureTypes } from "./figure-types.enum";

export interface IRectangleControl {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string; 
}

export interface ICreateRectangleDto {
  options: {
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
  };
  bounds: google.maps.LatLngBoundsLiteral;
  author: IFigureAuthor;
  title: string;
  description: string;
}

export interface IUpdateRectangleDto extends ICreateRectangleDto {
  id: number;
  createdAt: Date;
}

export class Rectangle extends AbstractFigure {
  private options: {
    fillColor: string,
    fillOpacity: number,
    strokeColor: string,
    editable: boolean
  }
  private bounds: google.maps.LatLngBoundsLiteral;
  override readonly type = FigureTypes.RECTANGLE;

  getOptions() {
    return {...this.options}
  }

  getBounds() {
    return {...this.bounds} as google.maps.LatLngBoundsLiteral
  }

  setBounds(newBounds: google.maps.LatLngBoundsLiteral) {
    this.bounds = newBounds
  }

  getEditable() {
    return this.options.editable
  }

  setEditable(bool: boolean) {
    this.options.editable = bool
  }

  getAll(): IUpdateRectangleDto {
    return {
      id: this.getId(),
      options: this.getOptions(),
      bounds: this.getBounds(),
      title: this.getTitle(),
      description: this.getDescription(),
      author: this.getAuthor(),
      createdAt: this.getCreatedAt()
    }
  }

  constructor(options: IUpdateRectangleDto) {
    super(options.id, options.author, options.title, options.description, options.createdAt);
    this.options = {
      ...options.options,
      editable: false
    };
    this.bounds = options.bounds;
  }
}