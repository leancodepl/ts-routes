import { SegmentOptionalParam, SegmentRequiredParam } from "segment";

export default function arg<TParam extends string, TOptional extends boolean = false>(
    name: TParam,
    options?: {
        optional?: TOptional,
        pattern?: string;
    },
): TOptional extends true ? SegmentOptionalParam<TParam> : SegmentRequiredParam<TParam> {
    const patternPart = options?.pattern ? `(${options.pattern})` : "";
    const requirementPart = options?.optional ? "?" : "";

    const segment: SegmentRequiredParam<any> | SegmentOptionalParam<any> = {
        name: name,
        type: options?.optional === true ? "optional-param" : "required-param",
        segment: `:${name}${patternPart}${requirementPart}`,
    };

    return segment as any;
}