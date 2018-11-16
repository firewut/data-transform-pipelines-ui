import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleAnalyticsEventsService } from './services/google/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'data-transform';

  constructor(
    @Inject(DOCUMENT) private document,
    private elementRef: ElementRef,
    private router: Router,
    private analytics: GoogleAnalyticsEventsService,
  ) {
  }

  ngOnInit() {
    if (this.analytics.googleAnalyticsUA) {
      const s = this.document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://www.googletagmanager.com/gtag/js?id=${this.analytics.googleAnalyticsUA}`;
      this.elementRef.nativeElement.appendChild(s);

      const ss = document.createElement('script');
      ss.type = 'text/javascript';
      ss.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${this.analytics.googleAnalyticsUA}');
      `;
      this.elementRef.nativeElement.appendChild(ss);

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.analytics.sendPageView(event.urlAfterRedirects);
        }
      });
    }
  }
}
