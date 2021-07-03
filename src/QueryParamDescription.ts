export default class QueryParamDescription<TReturnType = string, TOptional extends boolean = false> {
    private readonly _?: TReturnType;

    constructor(public readonly optional: TOptional) {}
}
