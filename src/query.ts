import { Optionality } from "./helpers";
import QueryParamDescription from "./QueryParamDescription";

type AllowedQueryParams = string | { [key: string]: AllowedQueryParams };

export default function query<
    TReturnType extends AllowedQueryParams = string,
    TOptionality extends Optionality = "required",
>(optionality: TOptionality = "required" as TOptionality) {
    return new QueryParamDescription<TReturnType, TOptionality>(optionality);
}
