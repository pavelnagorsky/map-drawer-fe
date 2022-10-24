import { createSelector } from "@ngrx/store";

import { IAppState } from "../reducers";

// получить массив маркеров
export const selectMarkers = createSelector(
  (state: IAppState) => state.markers,
  (rectanglesState) => rectanglesState.data
);