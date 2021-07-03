export default class PathParamDescription<TName extends string = string, TOptional extends boolean = true> {
    public readonly pattern: string;
    public readonly name: TName;
    public readonly optional: TOptional;

    constructor({ name, optional, pattern }: { name: TName; optional: TOptional; pattern?: string }) {
        const patternPart = pattern ? `(${pattern})` : "";
        const requirementPart = optional ? "?" : "";

        this.name = name;
        this.optional = optional ?? (false as any);
        this.pattern = `:${name}${patternPart}${requirementPart}`;
    }
}
