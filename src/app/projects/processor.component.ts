import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api/api.service';
import { Processor } from './classes/processor';

@Component({
  selector: 'app-processor',
  templateUrl: './processor.component.html',
  styleUrls: ['./processor.component.css']
})
export class ProcessorComponent implements OnInit {
  processor: Processor;

  layout = [
    '*',
    { type: 'submit', title: 'Valid' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api_service: APIService,
  ) { }

  ngOnInit() {
    this.getProcessor(
      this.route.snapshot.paramMap.get('id')
    );
  }

  getProcessor(id: string) {
    this.api_service.getProcessor(id)
      .subscribe(
        (processor: Processor) => {
          this.processor = new Processor(processor);
        }
      );
  }
}
