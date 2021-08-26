import { string, createRouting, segment } from "../../src";

describe("arg segment", () => {
    it("creates route with an arg segment", () => {
        const routes = createRouting({
            product: segment`/product/${string("productId")}`,
        } as const);

        const route = routes.product({ productId: "id" });

        expect(route).toEqual("/product/id");
    });

    it("creates route with an optional arg segment", () => {
        const routes = createRouting({
            product: segment`/product/${string("productId", "optional")}`,
        } as const);

        const route = routes.product();

        expect(route).toEqual("/product");
    });

    it("returns the correct path pattern when required", () => {
        const routes = createRouting({
            product: segment`/product/${string("productId")}`,
        } as const);

        const pattern = routes.product.pattern;

        expect(pattern).toEqual("/product/:productId");
    });

    it("returns the correct path pattern when optional", () => {
        const routes = createRouting({
            product: segment`/product/${string("productId", "optional")}`,
        } as const);

        const pattern = routes.product.pattern;

        expect(pattern).toEqual("/product/:productId?");
    });
});
