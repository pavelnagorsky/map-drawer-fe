import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapMarker } from '@angular/google-maps';
import { Subscription } from 'rxjs';
import { IFigure } from 'src/app/models/abstract-figure';

import { Marker } from 'src/app/models/marker.model';
import { DataConsumerService } from 'src/app/socket/data-consumer.service';
import { setInfoWindow } from 'src/app/store/actions/info-window.actions';
import { AppState } from 'src/app/store/reducers';
import { selectMarkers } from 'src/app/store/selectors/markers.selectors';
import { InfoWindowService } from '../info-window/info-window.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  private socketSubs: Subscription[] = [];
  markers: Marker[] = [];

  constructor(
    private readonly store: AppState,
    private readonly infoWindowService: InfoWindowService,
    private readonly dataFromSocket: DataConsumerService
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store
      .select(selectMarkers)
      .subscribe(markers => {
        this.markers = markers;
      });
    // подписка на обновление маркеров через сокеты
    this.socketSubs.push(
      this.dataFromSocket.subscribeAddMarker().subscribe(),
      this.dataFromSocket.subscribeDeleteMarker().subscribe()
    )
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.socketSubs.forEach(sub => sub.unsubscribe())
  }

  onViewInfo(markerEl: MapMarker, index: number) {
    const position = this.infoWindowService.getWindowPosition(markerEl);
    const marker = this.markers[index];
    const windowInfoData: IFigure = {
      id: marker.getId(),
      author: marker.getAuthor(),
      createdAt: marker.getCreatedAt(),
      title: marker.getTitle(),
      description: marker.getDescription(),
      type: marker.type
    }
    this.store.dispatch(setInfoWindow({
      position: position,
      data: windowInfoData
    }))
  }

}
