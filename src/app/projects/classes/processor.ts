export class ProcessorSchema {
    in: any;
    in_config: any;
    in_config_example: any;
    out: any = {};
    out_config: any = {};
    out_config_example: any;

    constructor(schema: any) {
        const properties: any = schema.properties;

        if (typeof (properties.in.type) === 'string') {
            properties.in.type = [properties.in.type];
        }
        if (typeof (properties.out.type) === 'string') {
            properties.out.type = [properties.out.type];
        }

        this.in = properties.in;
        this.out = properties.out;
        this.in_config = properties.in_config;
        this.in_config_example = properties.in_config_example;
        this.out_config = properties.out_config;
        this.out_config_example = properties.out_config_example;
    }
}

export class Processor {
    id: string;
    name: string;
    description: string;
    schema: ProcessorSchema;

    constructor(json: any) {
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        this.schema = new ProcessorSchema(
            json.schema
        );
    }

    public can_send_result(processor: Processor): boolean {
        const out_types = new Set(this.schema.out.type);
        const in_types = new Set(processor.schema.in.type);

        in_types.delete('null');
        out_types.delete('null');

        let intersection = [];
        if (in_types.size > 0) {
            intersection = Array.from(
                in_types.values()
            ).filter(
                value => -1 !== Array.from(
                    out_types.values()
                ).indexOf(
                    value
                )
            );
        } else {
            intersection = [null];
        }

        return intersection.length > 0;
    }
}

export class PipelineProcessor {
    id: string;
    in_config: any;
    out_config: any;
    template: Processor;

    // Internal
    _hash: string;

    // UI properties
    errors: string[];

    constructor(json?: any, processor?: Processor) {
        if (json) {
            this.id = json.id;
            this.in_config = json.in_config;
            this.out_config = json.out_config;
            this.template = new Processor(json.template);
        }
        if (processor) {
            this.id = processor.id;
            this.in_config = processor.schema.in_config_example;
            this.out_config = processor.schema.out_config_example;
            this.template = processor;
        }
        this._hash = Math.random().toString(36).replace('0.', '');
    }

    public can_send_result(processor: PipelineProcessor): boolean {
        return this.template.can_send_result(processor.template);
    }

    public in_config_is_valid(): boolean {
        var is_valid = true;

        return is_valid;
    }

    public out_config_is_valid(): boolean {
        var is_valid = true;

        return is_valid;
    }

    // TODO: DRY Refactor
    public set_in_schema(value?: any) {
        this.in_config = JSON.parse(value);
    }

    public set_out_schema(value?: any) {
        this.in_config = JSON.parse(value);
    }
}