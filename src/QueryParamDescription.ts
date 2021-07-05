import { Optionality } from "./helpers";

export default class QueryParamDescription<TReturnType = string, TOptionality extends Optionality = "required"> {
    private readonly _?: TReturnType;

    constructor(public readonly optionality: TOptionality) {}
}
