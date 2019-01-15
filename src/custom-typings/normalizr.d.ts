/*
 * From ngrx github
 */
declare namespace Normalizr {
    export class Schema {
        constructor(name: String, options?:any)
        define(nestedSchema: {[key: string]: Schema});
    }
    export function arrayOf(obj: any): Schema;

    export function normalize(obj: Object, schema: Schema);
}

declare module "normalizr" {
    export = Normalizr;
}
