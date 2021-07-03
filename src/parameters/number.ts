import PathParamDescription from "../PathParamDescription";

export default function uuid<TName extends string = string, TOptional extends boolean = false>(
    name: TName,
    {
        optional = false as TOptional,
    }: {
        optional?: TOptional;
    } = {},
) {
    const number = "[0-9]+";

    return new PathParamDescription({ name, optional, pattern: number });
}
