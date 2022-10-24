import { createReducer, on } from "@ngrx/store";

import * as Actions from '../actions/info-window.actions';
import { updateObject } from "src/app/shared/utils/update-object";
import { IFigure } from "src/app/models/abstract-figure";

export interface IWindowPosition {
  lat: number;
  lng: number;
}

export interface InfoWindowState {
  position: IWindowPosition;
  data: IFigure | null;
}

const initialState: InfoWindowState = {
  position: {
    lat: 0,
    lng: 0
  },
  data: null
}

interface ReduceFunction <T extends (...args: any[]) => any> {
  (
    state: InfoWindowState,
    action: ReturnType<T>
  ) : InfoWindowState
}

export const infoWindowReducer = createReducer(
  initialState,
  on(Actions.setInfoWindow, (state, action) => setInfoWindowReduce(state, action))
)

const setInfoWindowReduce: ReduceFunction<typeof Actions.setInfoWindow> = 
(state, action) => {
  return updateObject(state, {
    position: action.position,
    data: action.data
  })
}