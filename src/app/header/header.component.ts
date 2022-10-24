import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppState } from '../store/reducers';
import { selectIsAuth } from '../store/selectors/auth.selectors';
import { logout } from '../store/actions/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuth = false;
  private storeSub: Subscription;

  constructor(
    private store: AppState
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectIsAuth)
      .subscribe(
        isAuth => {
          this.isAuth = isAuth;
        }
      )
  }

  onLogout() {
    this.store.dispatch(logout());
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

}