import { createSelector } from "@ngrx/store";

import { IAppState } from "../reducers";

// получить массив прямоугольников
export const selectRectangles = createSelector(
  (state: IAppState) => state.rectangles,
  (rectanglesState) => rectanglesState.data
);