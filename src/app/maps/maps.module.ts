import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GoogleMapsModule } from "@angular/google-maps";

import { GoogleMapsService } from "./google-maps.service";
import { GoogleMapComponent } from "./google-map/google-map.component";
import { RectangleComponent } from "./rectangle/rectangle.component";
import { InfoWindowComponent } from "./info-window/info-window.component";
import { InfoWindowService } from "./info-window/info-window.service";
import { MarkerComponent } from "./marker/marker.component";
import { MarkerSerialize } from "./marker/serialization/marker.serialize";
import { RectangleSerialize } from "./rectangle/serialization/rectangle.serialize";
import { ControlsPanelComponent } from "./controls-panel/controls-panel.component";
import { SharedModule } from "../shared/shared.module";
import { MapDrawingDirective } from "./map-drawing/map-drawing.directive";

@NgModule({
  declarations: [
    GoogleMapComponent,
    RectangleComponent,
    InfoWindowComponent,
    MarkerComponent,
    ControlsPanelComponent,
    MapDrawingDirective
  ],
  imports: [
    GoogleMapsModule,
    RouterModule.forChild([
      { path: 'map', component: GoogleMapComponent } 
    ]),
    SharedModule
  ],
  providers: [
    GoogleMapsService,
    InfoWindowService,
    MarkerSerialize,
    RectangleSerialize
  ]
})
export class MapsModule { }