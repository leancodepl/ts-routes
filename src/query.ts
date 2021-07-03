import QueryParamDescription from "./QueryParamDescription";

type AllowedQueryParams = string | { [key: string]: AllowedQueryParams };

export default function query<TReturnType extends AllowedQueryParams = string, TOptional extends boolean = false>(
    optional: TOptional = false as TOptional,
) {
    return new QueryParamDescription<TReturnType, TOptional>(optional);
}
