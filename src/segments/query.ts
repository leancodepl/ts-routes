import { SegmentOptionalQuery, SegmentRequiredQuery } from "../segment";

type GetKeysAssignableTo<TValue, T> = { [K in keyof T]: T[K] extends TValue ? K : never }[keyof T];

export default function query<Q extends Record<string, boolean>>(
    params: Q,
): Array<
    | SegmentRequiredQuery<GetKeysAssignableTo<true, Q> & string>
    | SegmentOptionalQuery<GetKeysAssignableTo<false, Q> & string>
> {
    return Object.keys(params).map(name => ({ name, type: params[name] ? "required-query" : "optional-query" })) as any;
}
