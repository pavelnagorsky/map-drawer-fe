import { createAction, props } from "@ngrx/store";

import { FigureTypes } from "src/app/models/figure-types.enum";
import { ControlsState } from "../reducers/controls.reducer";
import { ControlsActionTypes } from "./action-types";

export const setControls = createAction(
  ControlsActionTypes.SET_CONTROLS,
  props<{
    controls: ControlsState
  }>()
)

export const setCurrentType = createAction(
  ControlsActionTypes.SET_CONTROLS_CURRENT_TYPE,
  props<{ currentType: FigureTypes }>()
)

export const setEnable = createAction(
  ControlsActionTypes.SET_ENABLE,
  props<{ enable: boolean }>()
)