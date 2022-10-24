import { Component, Input } from '@angular/core';

import { fadeInOut } from '../utils/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: fadeInOut
})
export class AlertComponent {
  @Input() message?: string;
  @Input() color: string;
}
