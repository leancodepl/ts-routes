/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
import { generatePath } from "react-router";

type ParamsFunction<TParams extends string> = { [TParam in TParams]: string } extends infer Params
    ? {} extends Params
        ? []
        : [Params]
    : never;

type GetParamsFromPath<TPath extends string> = TPath extends `${string}:${infer TParam}/${infer TRest}`
    ? TParam | GetParamsFromPath<TRest>
    : TPath extends `${string}:${infer TParam}`
    ? TParam
    : never;

type GetParams<TRoute> = TRoute extends { path: infer TPath extends string } ? GetParamsFromPath<TPath> : never;
type GetName<TRoute> = TRoute extends { name?: infer TName extends string } ? TName : never;
type GetChildren<TRoute> = TRoute extends { children: infer TChildren extends readonly any[] } ? TChildren : never;

type Routes<TRoutes, TPrefix extends string[] = [], TParams extends string = never> = TRoutes extends readonly any[]
    ?
          | {
                [Route in keyof TRoutes]: TRoutes[Route] extends { name: string }
                    ?
                          | (TRoutes[Route] extends { children: readonly any[] }
                                ? Routes<
                                      GetChildren<TRoutes[Route]>,
                                      [...TPrefix, GetName<TRoutes[Route]>],
                                      TParams | GetParams<TRoutes[Route]>
                                  >
                                : never)
                          | [
                                ...TPrefix,
                                GetName<TRoutes[Route]>,
                                ...ParamsFunction<TParams | GetParams<TRoutes[Route]>>,
                            ]
                    : never;
            }[number]
    : never;

type RouteElement = { name: string; path: string; children?: readonly RouteElement[] };

function mkPath<InternalRoutes extends ReadonlyArray<RouteElement>>(internalRoutes: InternalRoutes) {
    return function path(...path: Routes<InternalRoutes>) {
        function pathRec(
            aggregatedPath = "/",
            currentRoutes: readonly RouteElement[] = internalRoutes,
            depth = 0,
        ): string {
            const nameOrParams = path[depth];

            if (typeof nameOrParams === "string") {
                const nextRoute = currentRoutes.find(route => route.name === nameOrParams);

                if (nextRoute === undefined) {
                    throw new Error(`Couldn't find route [${path.join(",")}].`);
                }

                return pathRec(aggregatedPath + nextRoute.path, nextRoute.children, depth + 1);
            }

            if (nameOrParams === undefined) {
                return aggregatedPath;
            }

            return generatePath(aggregatedPath, nameOrParams);
        }

        return pathRec();
    };
}

export default mkPath;
