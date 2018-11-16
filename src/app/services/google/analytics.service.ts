import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class GoogleAnalyticsEventsService {
  public googleAnalyticsUA: string = undefined;

  constructor() {
    this.googleAnalyticsUA = environment.trackers.googleAnalyticsUA;
  }

  public sendPageView(page_url: string) {
    if (this.googleAnalyticsUA) {
      (<any>window).gtag(
        'config',
        this.googleAnalyticsUA, {
          'page_path': page_url
        }
      );
    }
  }

  public sendEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
  ) {
    if (this.googleAnalyticsUA) {
      (<any>window).gtag(
        'event', action, {
          'event_category': category,
          'event_label': label,
          'value': value || null,
        }
      );
    }
  }
}
