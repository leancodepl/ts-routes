import { compile } from "path-to-regexp";
import { IParseOptions, IStringifyOptions, parse, stringify } from "qs";
import PathParamDescription from "./PathParamDescription";
import QueryParamDescription from "./QueryParamDescription";
import RouteDescription from "./RouteDescription";

type MapToRoute<TRouteDescription extends RouteDescription<any, any, any>> = {
    (...params: [...args: PathPatternArgs<TRouteDescription>, stringifyOptions?: IStringifyOptions]): string;
    parseQuery: (query: string, parseOptions?: IParseOptions) => GetParsedQuery<TRouteDescription>;
    pattern: string;
} & {
    [TKey in keyof RouteChildren<TRouteDescription>]: MapToRoute<
        AddParams<RouteChildren<TRouteDescription>[TKey], TRouteDescription>
    >;
};

type RouteChildren<TRouteDescription extends RouteDescription<any, any, any>> =
    TRouteDescription extends RouteDescription<any, any, infer TChildren> ? TChildren : never;

type AddParams<
    TDestRoute extends RouteDescription<any, any, any>,
    TSourceRoute extends RouteDescription<any, any, any>,
> = TDestRoute extends RouteDescription<
    infer TDestPathParamsDescription,
    infer TDestQueryParamsDesrciption,
    infer TChildren
>
    ? TSourceRoute extends RouteDescription<
          infer TSourcePathParamsDescription,
          infer TSourceQueryParamsDescription,
          any
      >
        ? RouteDescription<
              [...TSourcePathParamsDescription, ...TDestPathParamsDescription],
              TSourceQueryParamsDescription & TDestQueryParamsDesrciption,
              TChildren
          >
        : never
    : never;

type MakeOptional<T> = {} extends T ? [T?] : [T];

type PathPatternArgs<TRouteDescription extends RouteDescription<any, any, any>> = [
    ...pathParams: MakeOptional<MapPathParams<GetPathParams<TRouteDescription>>>,
    ...queryParams: MakeOptional<MapQueryParams<GetQueryParams<TRouteDescription>>>
];

type GetPathParams<TRouteDescription extends RouteDescription<any, any, any>> =
    TRouteDescription extends RouteDescription<infer TPathParams, any, any> ? TPathParams : never;

type GetQueryParams<TRouteDescription extends RouteDescription<any, any, any>> =
    TRouteDescription extends RouteDescription<any, infer TQueryParams, any> ? TQueryParams : never;

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;

type MapPathParams<TPathParams extends PathParamDescription<string, boolean>[]> = UnionToIntersection<
    {
        [T in keyof TPathParams]: GetParam<TPathParams[T]>;
    }[number]
>;

type SingleOrArray<T> = T | T[];

type MapQueryParams<TQueryParams extends Record<string, QueryParamDescription<any, boolean>>> = {
    [TName in keyof TQueryParams as TQueryParams[TName] extends QueryParamDescription<any, true>
        ? TName
        : never]?: SingleOrArray<GetQueryResultType<TQueryParams[TName]>>;
} &
    {
        [TName in keyof TQueryParams as TQueryParams[TName] extends QueryParamDescription<any, false>
            ? TName
            : never]: SingleOrArray<GetQueryResultType<TQueryParams[TName]>>;
    };

type GetQueryResultType<TQueryParam extends QueryParamDescription<any, boolean>> =
    TQueryParam extends QueryParamDescription<infer TReturnType, boolean> ? TReturnType : never;

type GetParam<TPathParam> = TPathParam extends PathParamDescription<infer TName, infer TOptional>
    ? TOptional extends true
        ? {
              [T in TName]?: string;
          }
        : {
              [T in TName]: string;
          }
    : never;

type GetParsedQuery<TRouteDescription extends RouteDescription<any, any, any>> = MapQueryParams<
    GetQueryParams<TRouteDescription>
>;

export default function createRouting<TRoutes extends { readonly [name: string]: RouteDescription<any, any, any> }>(
    routes: TRoutes,
    options?: IStringifyOptions & IParseOptions,
): {
    readonly [TKey in keyof TRoutes]: MapToRoute<TRoutes[TKey]>;
} {
    function createRoute(currentPattern: string, { pattern: pattern2, children }: RouteDescription<any, any, any>) {
        const pattern = currentPattern + pattern2.pattern;
        const compiledPattern = compile(pattern);

        function route(
            pathParams: Record<string, any> | undefined,
            queryParams: Record<string, any> | undefined,
            overrideOptions?: IStringifyOptions,
        ) {
            const queryString = queryParams ? `?${stringify(queryParams, overrideOptions ?? options)}` : "";
            return compiledPattern(pathParams) + queryString;
        }

        route.pattern = pattern;
        route.parseQuery = (query: string, overrideOptions?: IParseOptions) => parse(query, overrideOptions ?? options);

        if (children) {
            for (const childRoute in children) {
                (route as any)[childRoute] = createRoute(pattern, children[childRoute]);
            }
        }

        return route;
    }

    const mappedRoutes: Record<keyof TRoutes, any> = {} as any;

    for (const route in routes) {
        mappedRoutes[route] = createRoute("", routes[route]);
    }

    return mappedRoutes;
}
