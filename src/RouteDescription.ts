import SegmentPattern from "./SegmentPattern";
import QueryParamDescription from "./QueryParamDescription";
import PathParamDescription from "./PathParamDescription";

export default interface RouteDescription<
    TPathParams extends PathParamDescription<string, boolean>[] = [],
    TQueryParams extends Record<string, QueryParamDescription<any, boolean>> = {},
    TChildren extends { readonly [name: string]: RouteDescription<any, any> } = {},
> {
    readonly pattern: SegmentPattern<TPathParams>;
    readonly query?: TQueryParams;
    readonly children?: TChildren;
}
