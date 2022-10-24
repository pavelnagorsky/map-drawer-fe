import { createSelector } from "@ngrx/store";

import { IAppState } from "../reducers";

// авторизирован или нет
export const selectIsAuth = createSelector(
  (state: IAppState) => state.auth,
  (authState) => authState.token !== null
)

// получить username
export const selectUsername = createSelector(
  (state: IAppState) => state.auth,
  (authState) => authState.username
)

// получить id пользователя
export const selectUserId = createSelector(
  (state: IAppState) => state.auth,
  (authState) => authState.userId
)

// получить публичную информацию о пользователе
export const selectUserData = createSelector(
  selectUserId,
  selectUsername,
  (userId, username) => {
    if (userId && username) {
      return {
        id: userId,
        username: username
      }
    } else {
      return null
    }
  }
)