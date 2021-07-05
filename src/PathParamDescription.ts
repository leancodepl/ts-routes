import { Optionality } from "./helpers";

export default class PathParamDescription<
    TName extends string = string,
    TOptionality extends Optionality = "optional",
> {
    public readonly pattern: string;
    public readonly name: TName;
    public readonly optionality: TOptionality;

    constructor({ name, optionality, pattern }: { name: TName; optionality: TOptionality; pattern?: string }) {
        const patternPart = pattern ? `(${pattern})` : "";
        const requirementPart = optionality === "optional" ? "?" : "";

        this.name = name;
        this.optionality = optionality;
        this.pattern = `:${name}${patternPart}${requirementPart}`;
    }
}
