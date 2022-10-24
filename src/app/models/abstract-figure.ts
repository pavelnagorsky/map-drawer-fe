import { FigureTypes } from "./figure-types.enum";

export interface IInfoControl {
  title: string;
  description: string;
}

export interface IFigureAuthor {
  id: number,
  username: string
}

export interface IFigure {
  id: number;
  author: IFigureAuthor;
  title: string;
  description: string;
  createdAt: Date;
  type: FigureTypes
}

export abstract class AbstractFigure {
  private id: number;
  private author: IFigureAuthor;
  private title: string;
  private description: string;
  private createdAt: Date;
  abstract readonly type: FigureTypes;

  getId() {
    return this.id
  }

  getAuthor() {
    return {...this.author} as IFigureAuthor
  }

  getTitle() {
    return this.title
  }

  getDescription() {
    return this.description
  }

  getCreatedAt() {
    return this.createdAt
  }

  constructor(
    id: number,
    author: IFigureAuthor,
    title: string,
    description: string,
    createdAt?: Date
  ) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt ?? new Date();
  }
}