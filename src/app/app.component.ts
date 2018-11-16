import { Component } from '@angular/core';

import { environment } from '../environments/environment';

const trackers = environment.trackers;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'data-transform';
  googleAnalyticsUA: string = undefined;

  constructor() {
    this.googleAnalyticsUA = trackers.googleAnalyticsUA;
  }
}
