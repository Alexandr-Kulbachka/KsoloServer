import { Message } from './message_model';

class ResponceMessage implements Message {
    private data: { name: string; parameters: any; errors: string[]; };

    constructor(name: string, parameters: any, errors: string[] = []) {
        this.data = { name, parameters, errors };
    }

    get name(): string {
        return this.data != null ? this.data.name : '';
    }

    set name(name: string) {
        this.name = name;
    }

    get parameters(): any {
        return this.data.parameters;
    }

    set parameters(parameters: any) {
        this.parameters = parameters;
    }

    get errors(): string[] {
        return this.data.errors;
    }

    set errors(errors: string[]) {
        this.errors = errors;

    }

    getResponceText(): string {
        return JSON.stringify(this.data);
    }
}

export default ResponceMessage;