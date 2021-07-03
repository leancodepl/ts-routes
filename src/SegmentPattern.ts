import PathParamDescription from "./PathParamDescription";

export default class SegmentPattern<TPathParamsDescription extends PathParamDescription<string, boolean>[]> {
    constructor(public readonly pattern: string, public readonly params: TPathParamsDescription) {}
}
