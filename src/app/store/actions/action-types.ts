export enum AuthActionTypes {
  LOGIN_START = "[AUTH] LOGIN_START",
  LOGIN_SUCCESS = "[AUTH] LOGIN_SUCCESS",
  AUTHENTICATE_FAIL = "[AUTH] AUTHENTICATE_FAIL",
  SIGNUP_START = "[AUTH] SIGNUP_START",
  CLEAR_ERROR = "[AUTH] CLEAR_ERROR",
  LOGOUT = "[AUTH] LOGOUT",
  AUTO_LOGIN = "[AUTH] AUTO_LOGIN"
}

export enum RectanglesActionTypes {
  FETCH_START = "[RECTANGLES] FETCH_START",
  FETCH_SUCCESS = "[RECTANGLES] FETCH_SUCCESS",
  FETCH_FAIL = "[RECTANGLES] FETCH_FAIL",
  ADD_RECTANGLE_START = "[RECTANGLES] ADD_RECTANGLE_START",
  ADD_RECTANGLE_FAIL = "[RECTANGLES] ADD_RECTANGLE_FAIL",
  ADD_RECTANGLE_SUCCESS = "[RECTANGLES] ADD_RECTANGLE_SUCCESS",
  UPDATE_RECTANGLE = "[RECTANGLES] UPDATE_RECTANGLE",
  DELETE_RECTANGLE = "[RECTANGLES] DELETE_RECTANGLE"
}

export enum MarkersActionTypes {
  FETCH_START = "[MARKERS] FETCH_START",
  FETCH_SUCCESS = "[MARKERS] FETCH_SUCCESS",
  FETCH_FAIL = "[MARKERS] FETCH_FAIL",
  ADD_MARKER_START = "[MARKERS] ADD_MARKER_START",
  ADD_MARKER_FAIL = "[MARKERS] ADD_MARKER_FAIL",
  ADD_MARKER_SUCCESS = "[MARKERS] ADD_MARKER_SUCCESS",
  DELETE_MARKER = "[MARKERS] DELETE_MARKER"
}

export enum InfoWindowActionTypes {
  SET_INFO_WINDOW = "[INFO_WINDOW] SET_INFO_WINDOW"
}

export enum ControlsActionTypes {
  SET_CONTROLS = "[CONTROLS] SET_CONTROLS",
  SET_CONTROLS_CURRENT_TYPE = "[CONTROLS] SET_CONTROLS_CURRENT_TYPE",
  SET_ENABLE = "[CONTROLS] SET_ENABLE"
}