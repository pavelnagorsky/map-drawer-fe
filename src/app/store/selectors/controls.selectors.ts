import { createSelector } from "@ngrx/store";

import { IAppState } from "../reducers";

// получить объект конфигурации маркера
export const selectMarkerControl = createSelector(
  (state: IAppState) => state.controls,
  (controlsState) => controlsState.markerControl
)

// получить объект конфигурации прямоугольника
export const selectRectangleControl = createSelector(
  (state: IAppState) => state.controls,
  (controlsState) => controlsState.rectangleControl
)