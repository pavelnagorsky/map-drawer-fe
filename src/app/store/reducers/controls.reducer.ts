import { createReducer, on } from "@ngrx/store";

import * as Actions from '../actions/controls.actions';
import { IRectangleControl } from "src/app/models/rectangle.model";
import { IMarkerControl } from "src/app/models/marker.model";
import { FigureTypes } from "src/app/models/figure-types.enum";
import { IInfoControl } from "src/app/models/abstract-figure";
import { updateObject } from "src/app/shared/utils/update-object";

export interface ControlsState {
  enabled: boolean,
  rectangleControl: IRectangleControl,
  markerControl: IMarkerControl,
  infoControl: IInfoControl,
  currentType: FigureTypes
}

const initialState: ControlsState = {
  enabled: false,
  currentType: FigureTypes.MARKER,
  infoControl: {
    title: 'Figure title',
    description: 'Figure description'
  },
  rectangleControl: {
    fillColor: '#000000',
    strokeColor: '#000000',
    fillOpacity: 0.2
  },
  markerControl: {
    url: undefined
  }
}

interface ReduceFunction <T extends (...args: any[]) => any> {
  (
    state: ControlsState,
    action: ReturnType<T>
  ) : ControlsState
}

export const controlsReducer = createReducer(
  initialState,
  on(Actions.setControls, (state, action) => setControlsReduce(state, action)),
  on(Actions.setCurrentType, (state, action) => setCurrentFigureTypeReduce(state, action)),
  on(Actions.setEnable, (state, action) => setEnableReduce(state, action))
)

// установить настройки
const setControlsReduce: ReduceFunction<typeof Actions.setControls> = 
(state, action) => {
  return { 
    ...action.controls
  }
}

// изменить тип активной фигуры
const setCurrentFigureTypeReduce: ReduceFunction<typeof Actions.setCurrentType> = 
(state, action) => {
  return updateObject(state, {
    currentType: action.currentType
  })
}

// включить или выключить режим рисования
const setEnableReduce: ReduceFunction<typeof Actions.setEnable> = 
(state, action) => updateObject(state, {
  enabled: action.enable
})