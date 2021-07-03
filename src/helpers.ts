export type PathParamsFor<T extends (...args: any[]) => string> = Parameters<T>[0] extends undefined
    ? {}
    : NonNullable<Parameters<T>[0]>;

export type QueryParamsFor<T extends (...args: any[]) => string> = Parameters<T>[1];
