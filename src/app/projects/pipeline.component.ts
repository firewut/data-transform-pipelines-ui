import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


import { APIService, PaginatedResponse } from '../services/api/api.service';
import { Pipeline, PipelineResult } from './classes/pipeline';
import { Processor, PipelineProcessor } from './classes/processor';
import { $ } from 'protractor';

@Component({
    selector: 'app-pipeline',
    templateUrl: './pipeline.component.html',
    styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit, OnDestroy {
    subs = new Subscription();

    pipeline: Pipeline;
    processors: Processor[];

    public uploader: FileUploader;
    public data: any;
    public pipeline_result: PipelineResult;

    // TODO: Replace this
    public data_file: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api_service: APIService,
        private dragulaService: DragulaService,
    ) {

    }

    ngOnInit() {
        const pipeline_id = this.route.snapshot.paramMap.get('id');
        this.getPipeline(pipeline_id);

        this.uploader = new FileUploader({
            url: this.api_service.getPipelineProcesingURL(
                pipeline_id
            ),
            itemAlias: 'File'
        });
        this.uploader.onBuildItemForm = (item, form) => {
            form.append(
                'processors',
                JSON.stringify(this.pipeline.processors)
            );
        };
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            if (status === 202) {
                this.data_file = null;
                if ( this.pipeline.finishes_with_file ) {
                    this.pipeline.result = new PipelineResult(
                        JSON.parse(response),
                        this.pipeline,
                    );
                    this.pipeline.start_refreshing_result(
                        (_result: any) => {
                            // pass
                        }
                    );
                }
            }
        };
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.subs.unsubscribe();
    }

    getPipeline(id: string) {
        this.api_service.getPipeline(id)
            .subscribe(
                (pipeline: Pipeline) => {
                    this.pipeline = new Pipeline(pipeline, this.api_service);
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
            case 'process':
                pipeline.process_with_refresh({
                    'data': this.data,
                    'processors': pipeline.processors,
                });
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
