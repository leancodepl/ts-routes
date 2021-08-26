import { Optionality } from "../helpers";
import PathParamDescription from "../PathParamDescription";

export default function arg<TName extends string = string, TOptionality extends Optionality = "required">(
    name: TName,
    {
        pattern,
        optionality = "required" as TOptionality,
    }: {
        pattern?: string;
        optionality?: TOptionality;
    } = {},
) {
    return new PathParamDescription({ name, optionality, pattern });
}
