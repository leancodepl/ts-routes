import PathParamDescription from "../PathParamDescription";

export default function uuid<TName extends string = string, TOptional extends boolean = false>(
    name: TName,
    {
        optional = false as TOptional,
    }: {
        optional?: TOptional;
    } = {},
) {
    const uuid = "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}";

    return new PathParamDescription({ name, optional, pattern: uuid });
}
