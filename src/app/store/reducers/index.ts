import { Injectable } from '@angular/core';
import { ActionReducerMap, Store } from '@ngrx/store';

import { authReducer, AuthState } from './auth.reducer';
import { controlsReducer, ControlsState } from './controls.reducer';
import { infoWindowReducer, InfoWindowState } from './info-window.reducer';
import { markersReducer, MarkersState } from './markers.reducer';
import { rectanglesReducer, RectanglesState } from './rectangles.reducer';

export interface IAppState {
  auth: AuthState;
  rectangles: RectanglesState;
  markers: MarkersState;
  infoWindow: InfoWindowState,
  controls: ControlsState
};

@Injectable({
  providedIn: 'root'
})
export class AppState extends Store<IAppState> {};

export const reducers: ActionReducerMap<IAppState, any> = {
  auth: authReducer,
  rectangles: rectanglesReducer,
  markers: markersReducer,
  infoWindow: infoWindowReducer,
  controls: controlsReducer
};