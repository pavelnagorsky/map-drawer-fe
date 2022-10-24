import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { AuthInterceptor } from "./services/interceptors/auth.interceptor";
import { BaseUrlInterceptor } from "./services/interceptors/base-url.interceptor";

@NgModule({
  imports: [],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: BaseUrlInterceptor,
      multi: true
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true
    }
  ]
})
export class CoreModule {}