import { createReducer, on } from "@ngrx/store";

import * as Actions from '../actions/markers.actions';
import { updateObject } from "src/app/shared/utils/update-object";
import { Marker } from "src/app/models/marker.model";

export interface MarkersState {
  data: Marker[];
  loading: boolean;
  error: boolean;
}

const initialState: MarkersState = {
  data: [],
  error: false,
  loading: false
}

interface ReduceFunction <T extends (...args: any[]) => any> {
  (
    state: MarkersState,
    action: ReturnType<T>
  ) : MarkersState
}

export const markersReducer = createReducer(
  initialState,
  on(Actions.fetchStart, (state, action) => fetchStartReduce(state, action)),
  on(Actions.fetchSuccess, (state, action) => fetchSuccessReduce(state, action)),
  on(Actions.fetchFail, (state, action) => fetchFailReduce(state, action)),
  on(Actions.addMarkerStart, (state, action) => addMarkerStartReduce(state, action)),
  on(Actions.addMarkerSuccess, (state, action) => addMarkerSuccessReduce(state, action)),
  on(Actions.addMarkerFail, (state, action) => addMarkerFailReduce(state, action)),
  on(Actions.deleteMarker, (state, action) => deleteMarkerReduce(state, action))
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
    data: action.markers,
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

const addMarkerStartReduce: ReduceFunction<typeof Actions.addMarkerStart> = 
(state, action) => {
  return updateObject(state, {
    error: false,
    loading: true
  })
}

const addMarkerSuccessReduce: ReduceFunction<typeof Actions.addMarkerSuccess> = 
(state, action) => {
  return updateObject(state, {
    loading: false,
    data: [...state.data, action.marker]
  })
}

const addMarkerFailReduce: ReduceFunction<typeof Actions.addMarkerFail> = 
(state, action) => {
  return updateObject(state, {
    loading: false,
    error: true
  })
}

const deleteMarkerReduce: ReduceFunction<typeof Actions.deleteMarker> = 
(state, action) => {
  const markers = [...state.data].filter(marker => {
    return marker.getId() !== action.id
  });
  return updateObject(state, {
    data: markers
  })
}