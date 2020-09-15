import { createRouting, number, query, segment } from "../../src";

describe("query segment", () => {
    it("creates route with an optional query param", () => {
        const routes = createRouting({
            product: segment`/product${query({ productId: false })}`,
        } as const);

        const route = routes.product();

        expect(route).toEqual("/product");
    });

    it("creates route with a required query param", () => {
        const routes = createRouting({
            product: segment`/product${query({ productId: true })}`,
        } as const);

        const route = routes.product({}, { productId: "2" });

        expect(route).toEqual("/product?productId=2");
    });

    it("creates route with multiple query params and they are sorted in alphabetical order", () => {
        const routes = createRouting({
            product: segment`/product${query({
                productId: true,
                details: true,
            })}`,
        } as const);

        const route = routes.product({}, { productId: "2", details: "false" });

        expect(route).toEqual(`/product?details=false&productId=2`);
    });

    it("adds query params at the end of the path in case of nested routes", () => {
        const routes = createRouting({
            product: {
                ...segment`/product${query({
                    filter: true,
                })}`,
                children: {
                    details: segment`/${number("productId")}`,
                },
            },
        } as const);

        const route = routes.product.details({ productId: "1" }, { filter: "value" });

        expect(route).toEqual(`/product/1?filter=value`);
    });

    it("ignores query params in the pattern", () => {
        const routes = createRouting({
            product: segment`/product${query({ productId: true })}`,
        } as const);

        const pattern = routes.product.pattern;

        expect(pattern).toEqual("/product");
    });
});
