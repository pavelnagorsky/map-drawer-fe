import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { Subscription, switchMap } from 'rxjs';

import { FigureTypes } from 'src/app/models/figure-types.enum';
import { RegExps } from 'src/app/shared/utils/reg-exps';
import { setControls, setCurrentType, setEnable } from 'src/app/store/actions/controls.actions';
import { AppState } from 'src/app/store/reducers';
import { ControlsState } from 'src/app/store/reducers/controls.reducer';
import { MarkerTypes } from '../marker/marker-types';

@Component({
  selector: 'app-controls-panel',
  templateUrl: './controls-panel.component.html',
  styleUrls: ['./controls-panel.component.scss']
})
export class ControlsPanelComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;

  controlsForm: FormGroup;
  controls: ControlsState;
  // получить массив типов маркеров
  markerTypes = new MarkerTypes().getTypes();

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: AppState
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.pipe(
      select(state => state.controls),
      switchMap(controls => {
        this.controls = controls;
        this.initForm();
        return this.controlsForm.valueChanges
      })
    )
      .subscribe(formValues => {
        this.updateControls(formValues)
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(setEnable({ enable: false }));
    this.storeSub.unsubscribe()
  }

  // инициализация формы
  private initForm() {
    this.controlsForm = this.fb.group({
      'enabled': [this.controls.enabled, [
        Validators.required
      ]],
      'title': [this.controls.infoControl.title, [
        Validators.required,
        Validators.pattern(RegExps.NoWhiteSpaces)
      ]],
      'description': [this.controls.infoControl.description, [
        Validators.required,
        Validators.pattern(RegExps.NoWhiteSpaces)
      ]],
      'markerType': [this.controls.markerControl.url ?? ''],
      'rectangleFillColor': [this.controls.rectangleControl.fillColor, [
        Validators.required
      ]],
      'rectangleFillOpacity': [this.controls.rectangleControl.fillOpacity, [
        Validators.required,
        Validators.min(0),
        Validators.max(1)
      ]],
      'rectangleStrokeColor': [this.controls.rectangleControl.strokeColor, [
        Validators.required
      ]]
    })
  }

  // обновить настроки фигур в state
  private updateControls(values: {[key: string]: any}) {
    if (this.controlsForm.valid) {
      this.store.dispatch(setControls({
        controls: {
          enabled: values['enabled'],
          infoControl: {
            title: values['title'],
            description: values['description']
          },
          markerControl: {
            url: values['markerType'] === '' ? undefined : values['markerType']
          },
          rectangleControl: {
            fillColor: values['rectangleFillColor'],
            fillOpacity: values['rectangleFillOpacity'],
            strokeColor: values['rectangleStrokeColor']
          },
          currentType: this.controls.currentType
        }
      }))
    }
  }

  // изменить тип используемой фигуры
  onChangeFigureType(figureType: 'MARKER' | 'RECTANGLE') {
    this.store.dispatch(setCurrentType({
      currentType: figureType as FigureTypes
    }))
  }

  // вернуть bootstrap класс active если данный тип фигуры активным
  isCurrentType(type: 'MARKER' | 'RECTANGLE') {
    return this.controls.currentType === type ? 'active' : ''
  }

  // для правильного отображения bootsrap классов is-valid, is-invalid
  isValid(field: string): string {
    if (this.controlsForm.get(field)) {
      return (
        !this.controlsForm.get(field)?.valid && this.controlsForm.get(field)?.touched) 
          ? 'is-invalid' 
          : this.controlsForm.get(field)?.touched 
            ? 'is-valid' 
            : '';
    } else {
      return ""
    }
  }

  // показывать ли сообщение подсказку для поля
  showControlMessage(field: string): boolean {
    let control = this.controlsForm.get(field);
    if (!control) return false;
    if (control.invalid && control.touched) {
      return true
    } else {
      return false
    }
  }

}