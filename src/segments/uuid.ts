import arg from "./arg";

export default function uuid<TParam extends string, TOptional extends boolean = false>(
    name: TParam,
    optional?: TOptional,
) {
    const uuid = "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}";

    return arg(name, { optional, pattern: uuid });
}
