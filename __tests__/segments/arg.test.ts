import { createRouting, segment, arg } from "../../src";

describe("arg segment", () => {
    it("creates route with a custom pattern param", () => {
        const routes = createRouting({
            product: segment`/product/${arg("productId", {
                pattern: /[0-9]{2}/.source,
            })}`,
        } as const);

        const route = routes.product({ productId: "23" });

        expect(route).toEqual("/product/23");
    });

    it("route with a custom pattern param gets correctly validated", () => {
        const routes = createRouting({
            product: segment`/product/${arg("productId", {
                pattern: /[0-9]{2}/.source,
            })}`,
        } as const);

        expect(() => routes.product({ productId: "123" })).toThrow();
    });

    it("returns the correct path pattern for custom regexes", () => {
        const routes = createRouting({
            product: segment`/product/${arg("productId", {
                pattern: /[0-9]{2}/.source,
            })}`,
        } as const);

        const pattern = routes.product.pattern;

        expect(pattern).toEqual("/product/:productId([0-9]{2})");
    });
});
