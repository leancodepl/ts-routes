import { Optionality } from "./helpers"
import PathParamDescription from "./PathParamDescription"
import QueryParamDescription from "./QueryParamDescription"
import SegmentPattern from "./SegmentPattern"

export default interface RouteDescription<
  TPathParams extends PathParamDescription<string, Optionality>[] = [],
  TQueryParams extends Record<string, QueryParamDescription<any, Optionality>> = {},
  TChildren extends { readonly [name: string]: RouteDescription<any, any> } = {},
> {
  readonly pattern: SegmentPattern<TPathParams>
  readonly query?: TQueryParams
  readonly children?: TChildren
}
