import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, exhaustMap, tap } from "rxjs";

import { 
  LoginRequestData,
  AuthService, 
  SignupResponseData,
  LoginResponseData,
  SignupRequestData,
  UserData
} from "src/app/auth/auth.service";
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // регистрация пользователя
  performSignup = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.signupStart),
      exhaustMap( signupData => this.handleSignup(signupData) )
    )
  )

  // авторизация пользователя и заполнение localStorage
  performLogin = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.loginStart),
      exhaustMap( loginData => this.handleLogin(loginData) )      
    )
  )

  // редирект при успешной авторизации
  performLoginSuccess = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.loginSuccess),
      tap(action => {
        this.router.navigate(['map'], { 
          queryParams: {
            edit: true
          }
        })
      })
    ), { dispatch: false }
  )

  performAutoLogin = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const user: UserData = JSON.parse(
          localStorage.getItem('user') || "null"
        );
        if (!user || (new Date() >= new Date(user.expirationDate)) ) {
          return AuthActions.logout();
        };
        return AuthActions.loginSuccess({
          userId: +user.userId,
          username: user.username,
          token: user.token
        })
      })
    )
  )

  // логаут пользователя
  performLogout = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearExpTimer();
        localStorage.removeItem('user');
        this.router.navigateByUrl('');
      })
    ), { dispatch: false }
  )

  private handleSignup(signupData: SignupRequestData) {
    return this.http.post<SignupResponseData>(
      '/auth/signup',
      signupData
    ).pipe(
      // далее автоматическая авторизация
      map(response => {
        const loginData: LoginRequestData = {
          email: signupData.email,
          password: signupData.password
        };
        return AuthActions.loginStart(loginData)
      }),
      catchError((err: HttpErrorResponse) => {
        return this.errorHandler(err)
      })
    )
  }

  private handleLogin(loginData: LoginRequestData) {
    return this.http.post<LoginResponseData>(
      "/auth/login",
      loginData
    ).pipe(
      tap((authResponse => {
        this.authService.setLogoutTimer(
          +authResponse.expiresIn
        )
      })),
      map(authResponse => {
        const expirationDate = new Date(
          new Date().getTime() + 
          +authResponse.expiresIn
        );
        localStorage.setItem("user", JSON.stringify({
          token: authResponse.token,
          userId: +authResponse.userId,
          username: authResponse.username,
          expirationDate: expirationDate
        }));
        return AuthActions.loginSuccess({
          userId: +authResponse.userId,
          username: authResponse.username,
          token: authResponse.token
        })
      }),
      catchError((err: HttpErrorResponse) => {
        return this.errorHandler(err)
      })
    )
  }

  private errorHandler(errorResponse: HttpErrorResponse) {
    let errorMessage = "Network error occured. Please, check your internet connection.";
    if (errorResponse.status === 500) {
      errorMessage = "Unknown server error. Please, check your internet connection."
    }
    if (errorResponse.error && errorResponse.error.message) {
      errorMessage = errorResponse.error.message;
    }
    return of(AuthActions.authFail({
      errorMessage: errorMessage
    }));
  }

}