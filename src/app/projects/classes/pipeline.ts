import { Observable, Subscription, timer, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';


import { PipelineProcessor } from './processor';
import { APIService } from '../../services/api/api.service';

export class PipelineResult {
    id: string;
    pipeline: Pipeline;
    ctime: Date;
    error: string;
    result: any;
    is_finished: boolean;

    constructor(json: any, pipeline?: Pipeline) {
        this.id = json.id;
        this.pipeline = pipeline;
        this.ctime = json.ctime;
        this.error = json.error;
        this.result = json.result;
        this.is_finished = json.is_finished;
    }

    public get_image(): string {
        let image_url = '';
        if (this.pipeline) {
            if (this.pipeline.finishes_with_file) {
                if (this.is_finished) {
                    if (
                        this.result.hasOwnProperty('mimetype') &&
                        this.result.mimetype.includes('image/')
                    ) {
                        image_url = this.pipeline.get_result_file_url(this.result);
                    }
                }
            }
        }

        return image_url;
    }

    public toJSON(): any {
        let pipeline_id = '';
        if (this.pipeline) {
            pipeline_id = this.pipeline.id;
        }
        return {
            'id': this.id,
            'pipeline': pipeline_id,
            'ctime': this.ctime,
            'error': this.error,
            'result': this.result,
            'is_finished': this.is_finished,
        };
    }
}

export class Pipeline {
    id: string;
    description: string;
    processors: PipelineProcessor[];
    project: string;
    title: string;
    ctime: Date;
    mtime: Date;

    // UI Properties
    disabled: boolean;
    should_be_saved = false;
    is_processing = false;
    starts_with_file = false;
    finishes_with_file = false;
    requires_input = false;
    result?: PipelineResult;

    in_types: Set<string>;
    out_types: Set<string>;

    api_service?: APIService;
    subscription: Subscription;

    constructor(json: any, api_service?: APIService) {
        this.id = json.id;
        this.description = json.description;
        this.processors = [];
        if (json.processors) {
            for (const json_processor of json.processors) {
                this.processors.push(
                    new PipelineProcessor(json_processor)
                );
            }
        }
        this.project = json.project;
        this.title = json.title;
        this.ctime = json.ctime;
        this.mtime = json.mtime;

        this.api_service = api_service;

        // Execute a check
        this.checkProcessors();
    }

    public setInputOutput() {
        if (this.processors && this.processors.length > 0) {
            this.in_types = this.processors[0].template.schema.in_types;
            this.out_types = this.processors[
                this.processors.length - 1
            ].template.schema.out_types;
        } else {
            this.in_types = undefined;
            this.out_types = undefined;
        }
    }

    public toJSON(): any {
        return {
            'id': this.id,
            'description': this.description,
            'processors': this.processors,
            'project': this.project,
            'title': this.title,
            'ctime': this.ctime,
            'mtime': this.mtime,
        };
    }

    public get_result_file_url(result: any): string {
        return this.api_service.getPipelineResultFileURL(
            result
        );
    }

    public stop_refreshing_result() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public start_refreshing_result(callback?: any) {
        this.subscription = timer(0, 1000).pipe(
            switchMap(
                () => this.refresh_result()
            )
        ).subscribe(
            (pipeline_result_json: any) => {
                this.result = new PipelineResult(
                    pipeline_result_json,
                    this,
                );
                if (this.result.is_finished) {
                    this.stop_refreshing_result();
                    if (callback) {
                        callback(this.result);
                    }
                }
            }
        );
    }

    public process_with_refresh(data: any, callback?: any): Observable<PipelineResult> {
        const result = this.process(data);

        this.stop_refreshing_result();

        result.subscribe(
            (_: any) => this.start_refreshing_result(callback)
        );

        return result;
    }

    public process(data: any): Observable<PipelineResult> {
        const process_result = this.api_service.processPipeline(this, data);
        process_result.subscribe(
            (pipeline_result_json: any) => {
                this.result = new PipelineResult(
                    pipeline_result_json,
                    this
                );
            }
        );

        return process_result;
    }

    public refresh_result(): Observable<PipelineResult> {
        const result = this.api_service.refreshPipelineResult(this.result.id);
        result.subscribe(
            (pipeline_result_json: any) => {
                this.result = new PipelineResult(
                    pipeline_result_json,
                    this
                );
            }
        );

        return result;
    }

    private _requires_input(): boolean {
        if (this.processors.length <= 0) {
            return false;
        }

        const in_types = new Set(
            this.processors[0].template.schema.in.type
        );

        if (in_types.has('null') && (in_types.size === 1)) {
            return false;
        }

        return true;
    }

    private _check_starts_with_file(): boolean {
        if (!this._requires_input()) {
            return false;
        }

        if (this.processors.length <= 0) {
            return false;
        }
        const in_types = new Set(
            this.processors[0].template.schema.in.type
        );
        return in_types.has('file');
    }

    private _check_finishes_with_file(): boolean {
        if (this.processors.length <= 0) {
            return false;
        }
        const out_types = new Set(
            this.processors[this.processors.length - 1].template.schema.out.type
        );
        return out_types.has('file');
    }

    public checkProcessors(): PipelineProcessor[] {
        const misplaced_processors: PipelineProcessor[] = [];
        const unconfigured_processors: PipelineProcessor[] = [];

        // Must ensure that Siblings processor's In and Out are compatible
        if (this.processors) {
            // Reset errors
            for (const processor of this.processors) {
                processor.errors = [];
            }

            // Check Pipeline Data Flow
            for (let _i = 0; _i < this.processors.length - 1; _i++) {
                const current_processor = this.processors[_i];
                const next_processor = this.processors[_i + 1];

                if (current_processor.can_send_result(next_processor) === false) {
                    misplaced_processors.push(current_processor);
                    current_processor.errors.push(
                        'Output Type does not match Next Processor Input Type'
                    );
                }
            }
        }

        this.requires_input = this._requires_input();
        this.starts_with_file = this._check_starts_with_file();
        this.finishes_with_file = this._check_finishes_with_file();

        this.setInputOutput();

        return [...misplaced_processors, ...unconfigured_processors];
    }
}
