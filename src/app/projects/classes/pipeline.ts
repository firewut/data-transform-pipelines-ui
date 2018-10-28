import { PipelineProcessor } from './processor';

export class Pipeline {
    id: string;
    description: string;
    processors: PipelineProcessor[];
    project: string;
    title: string;
    ctime: Date;
    mtime: Date;

    // UI properties
    disabled: boolean;
    should_be_saved = false;
    is_processing = false;
    starts_with_file = false;

    constructor(json: any) {
        this.id = json.id;
        this.description = json.description;
        this.processors = [];
        for (const json_processor of json.processors) {
            this.processors.push(
                new PipelineProcessor(json_processor)
            );
        }
        this.project = json.project;
        this.title = json.title;
        this.ctime = json.ctime;
        this.mtime = json.mtime;

        // Execute a check
        this.checkProcessors();
    }

    private _check_starts_with_file(): boolean {
        if (this.processors.length <= 0) {
            return false;
        }
        const in_types = new Set(this.processors[0].template.schema.in.type);
        return in_types.has('file');
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

            // Check Processor Config
            for (const processor of this.processors) {
                if (processor.in_config_is_valid() === false) {
                    processor.errors.push(
                        'Input Config is invalid'
                    );
                }
                if (processor.out_config_is_valid() === false) {
                    processor.errors.push(
                        'Output Config is invalid'
                    );
                }
            }
        }

        this.starts_with_file = this._check_starts_with_file();

        return [...misplaced_processors, ...unconfigured_processors];
    }
}
