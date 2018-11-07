import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api/api.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api_service: APIService,
  ) { }
}
