import PathParamDescription from "../PathParamDescription";

export default function arg<TName extends string = string, TOptional extends boolean = false>(
    name: TName,
    {
        pattern,
        optional = false as TOptional,
    }: {
        pattern?: string;
        optional?: TOptional;
    } = {},
) {
    return new PathParamDescription({ name, optional, pattern });
}
