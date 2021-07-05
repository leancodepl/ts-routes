import { Optionality } from "./helpers";
import PathParamDescription from "./PathParamDescription";

export default class SegmentPattern<TPathParamsDescription extends PathParamDescription<string, Optionality>[]> {
    constructor(public readonly pattern: string, public readonly params: TPathParamsDescription) {}
}
