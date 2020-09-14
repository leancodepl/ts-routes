import arg from "./arg";

export default function number<TParam extends string, TOptional extends boolean = false>(
    name: TParam,
    optional?: TOptional,
) {
    const number = "[0-9]+";

    return arg(name, { optional, pattern: number });
}
