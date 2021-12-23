export function isStringEmpty(str: string): boolean {
    return str && str.length == 0;
}

export function isStringNotEmpty(str: string): boolean {
    return str && str.length > 0;
}

export function isAllStringsNotEmpty(...strs: string[]): boolean {
    return strs.every((str) => str && str.length > 0);
}

export function isArrayEmpty(array: Array<any>): boolean {
    return array && array.length == 0;
}

export function isArrayNotEmpty(array: Array<any>): boolean {
    return array && array.length > 0;
}

export function isAllArraysEmpty(...arrays: Array<any>): boolean {
    return arrays.every((array) => array && array.length == 0);
}

export function isClassObjEmpty(obj: object): boolean {
    return !obj || Object.keys(obj).length === 0;
}

export function isClassObjNotEmpty(obj: object): boolean {
    return obj && Object.keys(obj).length !== 0;
}

