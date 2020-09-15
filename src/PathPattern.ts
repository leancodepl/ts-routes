export default class PathPattern<
    TRequiredParams extends string = string,
    TOptionalParams extends string = string,
    TRequiredQuery extends string = string,
    TOptionalQuery extends string = string
> {
    private readonly _?: [TRequiredParams, TOptionalParams, TRequiredQuery, TOptionalQuery];

    constructor(public readonly pattern: string) {}
}

export type PathRequiredParams<TPathPattern extends PathPattern> = TPathPattern extends PathPattern<
    infer TRequiredParams,
    any,
    any,
    any
>
    ? TRequiredParams
    : never;

export type PathOptionalParams<TPathPattern extends PathPattern> = TPathPattern extends PathPattern<
    any,
    infer TOptionalParams,
    any,
    any
>
    ? TOptionalParams
    : never;

export type PathRequiredQuery<TPathPattern extends PathPattern> = TPathPattern extends PathPattern<
    any,
    any,
    infer TRequiredQuery,
    any
>
    ? TRequiredQuery
    : never;

export type PathOptionalQuery<TPathPattern extends PathPattern> = TPathPattern extends PathPattern<
    any,
    any,
    any,
    infer TOptionalQuery
>
    ? TOptionalQuery
    : never;
