import { Injectable } from '@angular/core';

import { AppState } from '../store/reducers';
import * as AuthActions from '../store/actions/auth.actions';

export interface LoginRequestData {
  email: string;
  password: string;
}

export interface SignupRequestData extends LoginRequestData {
  username: string;
}

export interface SignupResponseData {
  message: string;
  userId: number;
};

export interface LoginResponseData extends SignupResponseData {
  token: string;
  expiresIn: number;
  username: string;
}

export interface LoginSuccessData {
  token: string;
  userId: number;
  username: string;
}

export interface UserData extends LoginSuccessData {
  expirationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpTimer: any | null;

  constructor(
    private store: AppState
  ) { }

  setLogoutTimer(expirationTime: number) {
    this.tokenExpTimer = setTimeout(
      () => this.store.dispatch(AuthActions.logout()), 
      expirationTime
    )
  } 

  clearExpTimer() {
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    this.tokenExpTimer = null;
  }
}