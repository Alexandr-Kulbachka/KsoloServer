class MethodResponce {
    result: any;
    errors: string[];

    constructor(result: any, errors: string[] = []) {
        this.result = result;
        this.errors = errors;
    }
}

export default MethodResponce;