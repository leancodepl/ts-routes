import { compile } from "path-to-regexp";
import { stringify } from "query-string";
import RouteDescription, { RouteChildren, RouteOptionalParams, RouteOptionalQuery, RouteRequiredParams, RouteRequiredQuery } from "./RouteDescription";

type PathPatternArgs<
    TRequiredParams extends string,
    TOptionalParams extends string,
    TRequiredQuery extends string,
    TOptionalQuery extends string
> = [TRequiredParams] extends [never]
    ? [TRequiredQuery] extends [never]
        ? [Partial<Record<TOptionalParams, string>>?, Partial<Record<TOptionalQuery, string>>?]
        : [
              Partial<Record<TOptionalParams, string>>,
              Record<TRequiredQuery, string> & Partial<Record<TOptionalQuery, string>>,
          ]
    : [TRequiredQuery] extends [never]
    ? [
          Record<TRequiredParams, string> & Partial<Record<TOptionalParams, string>>,
          Partial<Record<TOptionalQuery, string>>?,
      ]
    : [
          Record<TRequiredParams, string> & Partial<Record<TOptionalParams, string>>,
          Record<TRequiredQuery, string> & Partial<Record<TOptionalQuery, string>>,
      ];

type AddParams<
    TSourceRouteDescription extends RouteDescription,
    TDestRouteDescription extends RouteDescription
    > = RouteDescription<
        RouteRequiredParams<TSourceRouteDescription> | RouteRequiredParams<TDestRouteDescription>,
        RouteOptionalParams<TSourceRouteDescription> | RouteOptionalParams<TDestRouteDescription>,
        RouteRequiredQuery<TSourceRouteDescription> | RouteRequiredQuery<TDestRouteDescription>,
        RouteOptionalQuery<TSourceRouteDescription> | RouteOptionalQuery<TDestRouteDescription>,
        RouteChildren<TSourceRouteDescription>
    >;

type MapToRoute<TRouteDescription extends RouteDescription> = {
    (
        ...params: PathPatternArgs<
            RouteRequiredParams<TRouteDescription>,
            RouteOptionalParams<TRouteDescription>,
            RouteRequiredQuery<TRouteDescription>,
            RouteOptionalQuery<TRouteDescription>
        >
    ): string;
    pattern: string;
} & {
    [TKey in keyof RouteChildren<TRouteDescription>]: MapToRoute<
        AddParams<RouteChildren<TRouteDescription>[TKey], TRouteDescription>
    >;
    };

export default function createRouting<
    TRoutes extends { readonly [name: string]: RouteDescription }
>(routes: TRoutes): { readonly [TKey in keyof TRoutes]: MapToRoute<TRoutes[TKey]> } {
    function createRoute(currentPattern: string, currentRoute: RouteDescription<string, string, string, string, any>) {
        const pattern = currentPattern + currentRoute.pattern.pattern;
        const compiledPattern = compile(pattern);

        function route(params: Record<string, string> | undefined, queryParams: Record<string, string> | undefined) {
            const queryString = queryParams ? `?${stringify(queryParams)}` : ""
            return compiledPattern(params) + queryString;
        }

        route.pattern = pattern;

        if (currentRoute.children) {
            for (const childRoute in currentRoute.children) {
                (route as any)[childRoute] = createRoute(pattern, currentRoute.children[childRoute]);
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
