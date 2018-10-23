import { Pipeline } from './pipeline';

export class Project {
    id: string;
    title: string;
    description: string;
    ctime: Date;
    mtime: Date;
    pipelines: Pipeline[];

    constructor(json: any) {
        this.id = json.id;
        this.title = json.title;
        this.description = json.description;
        this.ctime = json.ctime;
        this.mtime = json.mtime;
        this.pipelines = [];
        for (const json_pipeline of json.pipelines) {
            this.pipelines.push(
                new Pipeline(json_pipeline)
            );
        }
    }
}
