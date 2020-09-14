import PathPattern, { PathOptionalParams, PathOptionalQuery, PathRequiredParams, PathRequiredQuery } from "PathPattern";

export default interface RouteDescription<
    TRequiredParams extends string = string,
    TOptionalParams extends string = string,
    TRequiredQuery extends string = string,
    TOptionalQuery extends string = string,
    TChildren extends { readonly [name: string]: RouteDescription } = any
> {
    readonly pattern: PathPattern<TRequiredParams, TOptionalParams, TRequiredQuery, TOptionalQuery>;
    readonly children?: TChildren;
}

export type PathPatternOf<TRouteDescription extends RouteDescription> = TRouteDescription["pattern"];
    
export type RouteRequiredParams<TRouteDescription extends RouteDescription> = PathRequiredParams<PathPatternOf<TRouteDescription>>;
export type RouteOptionalParams<TRouteDescription extends RouteDescription> = PathOptionalParams<PathPatternOf<TRouteDescription>>;
export type RouteRequiredQuery<TRouteDescription extends RouteDescription> = PathRequiredQuery<PathPatternOf<TRouteDescription>>;
export type RouteOptionalQuery<TRouteDescription extends RouteDescription> = PathOptionalQuery<PathPatternOf<TRouteDescription>>;

export type RouteChildren<TRD extends RouteDescription> = TRD extends RouteDescription<
    string,
    string,
    string,
    string,
    infer C
>
    ? C
    : never;