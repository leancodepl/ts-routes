import SegmentPattern from "./SegmentPattern";
import QueryParamDescription from "./QueryParamDescription";
import PathParamDescription from "./PathParamDescription";
import { Optionality } from "./helpers";

export default interface RouteDescription<
    TPathParams extends PathParamDescription<string, Optionality>[] = [],
    TQueryParams extends Record<string, QueryParamDescription<any, Optionality>> = {},
    TChildren extends { readonly [name: string]: RouteDescription<any, any> } = {},
> {
    readonly pattern: SegmentPattern<TPathParams>;
    readonly query?: TQueryParams;
    readonly children?: TChildren;
}
