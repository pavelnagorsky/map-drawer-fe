import { createAction, props } from "@ngrx/store";

import { ICreateMarkerDto, Marker } from "src/app/models/marker.model";
import { MarkersActionTypes } from "./action-types";

export const fetchStart = createAction(
  MarkersActionTypes.FETCH_START
)

export const fetchSuccess = createAction(
  MarkersActionTypes.FETCH_SUCCESS,
  props<{ markers: Marker[] }>()
)

export const fetchFail = createAction(
  MarkersActionTypes.FETCH_FAIL
)

export const addMarkerStart = createAction(
  MarkersActionTypes.ADD_MARKER_START,
  props<{ markerDto: ICreateMarkerDto }>()
)

export const addMarkerSuccess = createAction(
  MarkersActionTypes.ADD_MARKER_SUCCESS,
  props<{ marker: Marker }>()
)

export const addMarkerFail = createAction(
  MarkersActionTypes.ADD_MARKER_FAIL
)

export const deleteMarker = createAction(
  MarkersActionTypes.DELETE_MARKER,
  props<{ id: number, sendToServer: boolean }>()
)