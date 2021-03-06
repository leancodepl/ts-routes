import { URLSearchParams } from "url";
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

    it("creates route with multiple query params", () => {
        const routes = createRouting({
            product: segment`/product${query({
                productId: true,
                details: true,
            })}`,
        } as const);

        const route = routes.product({}, { productId: "2", details: "false" });

        expect(route.startsWith(`/product?`));

        const searchParams = new URLSearchParams(route.split("?")[1]);
        expect(Array.from(searchParams.keys()).length).toEqual(2);
        expect(searchParams.get("details")).toEqual("false");
        expect(searchParams.get("productId")).toEqual("2");
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
