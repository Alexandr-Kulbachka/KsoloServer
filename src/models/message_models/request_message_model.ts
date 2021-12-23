import { Message } from './message_model';

class RequestMessage implements Message {
    private data: { name: string; parameters: Map<string, any>; };

    constructor(request: string) {
        let data = JSON.parse(request);

        if (!data && (!data.parameters || !data.parameters)) {
            throw new Error('Invalid message payload received: ' + request);
        }

        this.data = data;
    }

    get name(): string {
        return this.data != null ? this.data.name : '';
    }

    get parameters(): Map<string, any> {
        return this.data != null ? this.data.parameters : new Map();
    }
}

export default RequestMessage;