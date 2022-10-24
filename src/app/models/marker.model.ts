import { AbstractFigure, IFigureAuthor } from "./abstract-figure";
import { FigureTypes } from "./figure-types.enum";

export interface IMarkerControl {
  url?: string;
}

export interface ICreateMarkerDto {
  position: google.maps.LatLngLiteral;
  author: IFigureAuthor;
  title: string;
  description: string;
  url?: string;
}

export interface IUpdateMarkerDto extends ICreateMarkerDto {
  id: number;
  createdAt: Date;
}

export class Marker extends AbstractFigure {
  private position: google.maps.LatLngLiteral;
  private icon?: {
    url: string
  };
  override readonly type = FigureTypes.MARKER;

  getPosition() {
    return {...this.position} as google.maps.LatLngLiteral
  }

  getIcon() {
    return this.icon ? {...this.icon} : ''
  }

  getAll(): IUpdateMarkerDto {
    return {
      id: this.getId(),
      createdAt: this.getCreatedAt(),
      position: this.getPosition(),
      url: this.icon?.url,
      title: this.getTitle(),
      description: this.getDescription(),
      author: this.getAuthor()
    }
  }
  
  constructor(options: IUpdateMarkerDto) {
    super(options.id, options.author, options.title, options.description, options.createdAt);
    this.position = options.position;
    if (options.url) {
      this.icon = {
        url: options.url
      }
    }
  }
}