import PathPattern from "./PathPattern";

export type SegmentRequiredParam<TParam extends string> = {
    name: TParam;
    type: "required-param";
    segment: string;
};

export type SegmentOptionalParam<TParam extends string> = {
    name: TParam;
    type: "optional-param";
    segment: string;
};

export type SegmentRequiredQuery<TParam extends string> = {
    name: TParam;
    type: "required-query";
};

export type SegmentOptionalQuery<TParam extends string> = {
    name: TParam;
    type: "optional-query";
};

export default function segment<
    TRequiredParam extends string = never,
    TOptionalParam extends string = never,
    TRequiredQuery extends string = never,
    TOptionalQuery extends string = never
>(
    literals: TemplateStringsArray,
    ...placeholders: (
        | SegmentRequiredParam<TRequiredParam>
        | SegmentOptionalParam<TOptionalParam>
        | SegmentRequiredQuery<TRequiredQuery>
        | SegmentOptionalQuery<TOptionalQuery>
        | Array<
              | SegmentRequiredParam<TRequiredParam>
              | SegmentOptionalParam<TOptionalParam>
              | SegmentRequiredQuery<TRequiredQuery>
              | SegmentOptionalQuery<TOptionalQuery>
          >
    )[]
) {
    let result = "";

    for (let i = 0; i < placeholders.length; i++) {
        result += literals[i];
        const placeholder = placeholders[i];
        if ("segment" in placeholder) {
            result += placeholder.segment;
        }
    }

    result += literals[literals.length - 1];

    return {
        pattern: new PathPattern<TRequiredParam, TOptionalParam, TRequiredQuery, TOptionalQuery>(result),
    };
}
