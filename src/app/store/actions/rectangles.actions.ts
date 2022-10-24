import { createAction, props } from "@ngrx/store";

import { ICreateRectangleDto, Rectangle } from "src/app/models/rectangle.model";
import { RectanglesActionTypes } from "./action-types";

export const fetchStart = createAction(
  RectanglesActionTypes.FETCH_START
)

export const fetchSuccess = createAction(
  RectanglesActionTypes.FETCH_SUCCESS,
  props<{ rectangles: Rectangle[] }>()
)

export const fetchFail = createAction(
  RectanglesActionTypes.FETCH_FAIL
)

export const addRectangleStart = createAction(
  RectanglesActionTypes.ADD_RECTANGLE_START,
  props<{ rectangleDto: ICreateRectangleDto }>()
)

export const addRectangleSuccess = createAction(
  RectanglesActionTypes.ADD_RECTANGLE_SUCCESS,
  props<{ rectangle: Rectangle }>()
)

export const addRectangleFail = createAction(
  RectanglesActionTypes.ADD_RECTANGLE_FAIL
)

export const updateRectangle = createAction(
  RectanglesActionTypes.UPDATE_RECTANGLE,
  props<{ rectangle: Rectangle, sendToServer: boolean }>()
)

export const deleteRectangle = createAction(
  RectanglesActionTypes.DELETE_RECTANGLE,
  props<{ id: number, sendToServer: boolean }>()
)