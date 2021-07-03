import PathParamDescription from "../PathParamDescription";

export default function string<TName extends string = string, TOptional extends boolean = false>(
    name: TName,
    {
        optional = false as TOptional,
    }: {
        optional?: TOptional;
    } = {},
) {
    return new PathParamDescription({ name, optional });
}
