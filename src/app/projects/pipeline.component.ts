import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { APIService, PaginatedResponse } from '../services/api/api.service';
import { Pipeline } from './classes/pipeline';
import { Processor, PipelineProcessor } from './classes/processor';

@Component({
    selector: 'app-pipeline',
    templateUrl: './pipeline.component.html',
    styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit, OnDestroy {
    subs = new Subscription();

    pipeline: Pipeline;
    processors: Processor[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api_service: APIService,
        private dragulaService: DragulaService,
    ) {

    }

    ngOnInit() {
        this.getPipeline(
            this.route.snapshot.paramMap.get('id')
        );
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.subs.unsubscribe();
    }

    getPipeline(id: string) {
        this.api_service.getPipeline(id)
            .subscribe(
                (pipeline: Pipeline) => {
                    this.pipeline = new Pipeline(pipeline);
                    this.pipelineChanged(this.pipeline);

                    // Request a list of processors
                    this.api_service.getProcessors(1, 1000)
                        .subscribe(
                            (paginated_response: PaginatedResponse) => {
                                this.processors = [];
                                for (const processor_result of paginated_response.results) {
                                    this.processors.push(
                                        new Processor(processor_result)
                                    );
                                }
                            }
                        );
                }
            );
    }

    pipelineChanged(pipeline: Pipeline) {
        pipeline.should_be_saved = false;

        const invalid_processors = pipeline.checkProcessors();
        pipeline.should_be_saved = invalid_processors.length === 0;
    }

    pipelineAction(action: string, pipeline: Pipeline, event?: any, processor?: PipelineProcessor) {
        switch (action) {
            case 'save':
                if (pipeline.should_be_saved) {
                    pipeline.is_processing = true;
                    this.api_service.putPipeline(pipeline)
                        .subscribe(
                            (_: Pipeline) => {
                                pipeline.is_processing = false;
                                pipeline.should_be_saved = false;
                            }
                        );
                }
                break;
            case 'delete':
                alert("Not Yet Implemented");
                break;
            case 'remove_processor':
                if (processor !== undefined) {
                    const index = pipeline.processors.findIndex(
                        x => x._hash === processor._hash
                    );
                    if (index > -1) {
                        pipeline.processors.splice(index, 1);
                        this.pipelineChanged(pipeline);
                    }
                }
                break;
            case 'add_processor':
                if (event !== undefined) {
                    for (const _processor of this.processors) {
                        if (_processor.id === event) {
                            pipeline.processors.push(
                                new PipelineProcessor(undefined, _processor)
                            );
                            this.pipelineChanged(pipeline);
                        }
                    }
                }
                break;
        }
    }
}