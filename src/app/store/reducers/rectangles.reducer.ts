import { createReducer, on } from "@ngrx/store";

import { Rectangle } from "src/app/models/rectangle.model";
import * as Actions from '../actions/rectangles.actions';
import { updateObject } from "src/app/shared/utils/update-object";

export interface RectanglesState {
  data: Rectangle[];
  loading: boolean;
  error: boolean;
}

const initialState: RectanglesState = {
  data: [],
  error: false,
  loading: false
}

interface ReduceFunction <T extends (...args: any[]) => any> {
  (
    state: RectanglesState,
    action: ReturnType<T>
  ) : RectanglesState
}

export const rectanglesReducer = createReducer(
  initialState,
  on(Actions.fetchStart, (state, action) => fetchStartReduce(state, action)),
  on(Actions.fetchSuccess, (state, action) => fetchSuccessReduce(state, action)),
  on(Actions.fetchFail, (state, action) => fetchFailReduce(state, action)),
  on(Actions.addRectangleStart, (state, action) => addRectangleStartReduce(state, action)),
  on(Actions.addRectangleSuccess, (state, action) => addRectangleSuccessReduce(state, action)),
  on(Actions.addRectangleFail, (state, action) => addRectangleFailReduce(state, action)),
  on(Actions.updateRectangle, (state, action) => updateRectangleReduce(state, action)),
  on(Actions.deleteRectangle, (state, action) => deleteRectangleReduce(state, action))
)

const fetchStartReduce: ReduceFunction<typeof Actions.fetchStart> = 
(state, action) => {
  return updateObject(state, {
    error: false,
    loading: false
  })
}

const fetchSuccessReduce: ReduceFunction<typeof Actions.fetchSuccess> = 
(state, action) => {
  return updateObject(state, {
    data: action.rectangles,
    loading: false
  })
}

const fetchFailReduce: ReduceFunction<typeof Actions.fetchFail> = 
(state, action) => {
  return updateObject(state, {
    error: true,
    loading: false
  })
}

const addRectangleStartReduce: ReduceFunction<typeof Actions.addRectangleStart> =
(state, action) => {
  return updateObject(state, {
    loading: true,
    error: false
  })
}

const addRectangleSuccessReduce: ReduceFunction<typeof Actions.addRectangleSuccess> =
(state, action) => {
  return updateObject(state, {
    loading: false,
    data: [...state.data, action.rectangle]
  })
}

const addRectangleFailReduce: ReduceFunction<typeof Actions.addRectangleFail> =
(state, action) => {
  return updateObject(state, {
    loading: false,
    error: true
  })
}

const updateRectangleReduce: ReduceFunction<typeof Actions.updateRectangle> =
(state, action) => {
  const index = state.data.findIndex(rect => rect.getId() === action.rectangle.getId());
  if (index === -1) return state;
  const updatedRectangles = [...state.data];
  updatedRectangles[index] = action.rectangle;
  return updateObject(state, {
    data: updatedRectangles
  })
}

const deleteRectangleReduce: ReduceFunction<typeof Actions.deleteRectangle> = 
(state, action) => {
  const rectangles = [...state.data].filter(rectangle => {
    return rectangle.getId() !== action.id
  });
  return updateObject(state, {
    data: rectangles
  })
}