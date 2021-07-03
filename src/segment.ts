import PathParamDescription from "./PathParamDescription";
import SegmentPattern from "./SegmentPattern";

export default function segment<TPathParamsDescription extends PathParamDescription<string, boolean>[]>(
    literals: TemplateStringsArray,
    ...placeholders: TPathParamsDescription
) {
    let result = "";

    for (let i = 0; i < placeholders.length; i++) {
        result += literals[i];
        result += placeholders[i].pattern;
    }

    result += literals[literals.length - 1];

    return {
        pattern: new SegmentPattern<TPathParamsDescription>(result, placeholders),
    };
}
