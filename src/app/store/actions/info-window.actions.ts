import { createAction, props } from "@ngrx/store";

import { IFigure } from "src/app/models/abstract-figure";
import { IWindowPosition } from "../reducers/info-window.reducer";
import { InfoWindowActionTypes } from "./action-types";

export const setInfoWindow = createAction(
  InfoWindowActionTypes.SET_INFO_WINDOW,
  props<{
    position: IWindowPosition,
    data: IFigure
  }>()
)