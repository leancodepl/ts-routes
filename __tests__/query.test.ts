import { URLSearchParams } from "url";
import { createRouting, number, query, segment } from "../src";

describe("query", () => {
    it("creates route with an optional query param", () => {
        const routes = createRouting({
            product: {
                ...segment`/product`,
                query: {
                    productId: query(true),
                },
            },
        } as const);

        const route = routes.product();

        expect(route).toEqual("/product");
    });

    it("creates route with a required query param", () => {
        const routes = createRouting({
            product: {
                ...segment`/product`,
                query: {
                    productId: query(false),
                },
            },
        } as const);

        const route = routes.product({}, { productId: "2" });

        expect(route).toEqual("/product?productId=2");
    });

    it("creates route with multiple query params", () => {
        const routes = createRouting({
            product: {
                ...segment`/product`,
                query: {
                    productId: query(false),
                    details: query(true),
                },
            },
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
                ...segment`/product`,
                query: {
                    filter: query(false),
                },
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
            product: {
                ...segment`/product`,
                query: {
                    productId: query(true),
                },
            },
        } as const);

        const pattern = routes.product.pattern;

        expect(pattern).toEqual("/product");
    });

    describe("parsing", () => {
        function extractQuery(url: string) {
            return url.split("?")[1];
        }

        it("saves and parses string query properties correctly", () => {
            const routes = createRouting({
                product: {
                    ...segment`/product`,
                    query: {
                        productId: query(),
                    },
                },
            });

            const url = routes.product(undefined, { productId: "product" });
            const parsed = routes.product.parseQuery(extractQuery(url));

            expect(parsed.productId).toEqual("product");
        });

        it("saves and parses arrays correctly", () => {
            const routes = createRouting({
                product: {
                    ...segment`/product`,
                    query: {
                        productsIds: query(),
                    },
                },
            });

            const url = routes.product(undefined, { productsIds: ["some", "another"] });
            const parsed = routes.product.parseQuery(extractQuery(url));

            expect(parsed.productsIds).toEqual(["some", "another"]);
        });

        it("saves and parses objects correctly", () => {
            const routes = createRouting({
                product: {
                    ...segment`/product`,
                    query: {
                        productsIds: query<{ a: string; b: string }>(),
                    },
                },
            });

            const url = routes.product(undefined, { productsIds: { a: "some", b: "another" } });
            const parsed = routes.product.parseQuery(extractQuery(url));

            expect(parsed.productsIds).toEqual({ a: "some", b: "another" });
        });

        it("saves and parses array of objects correctly", () => {
            const routes = createRouting({
                product: {
                    ...segment`/product`,
                    query: {
                        productsIds: query<{ a: string; b: string }>(),
                    },
                },
            });

            const url = routes.product(undefined, {
                productsIds: [
                    { a: "some", b: "another" },
                    { a: "yet another", b: "and another" },
                ],
            });

            const parsed = routes.product.parseQuery(extractQuery(url));

            expect(parsed.productsIds).toEqual([
                { a: "some", b: "another" },
                { a: "yet another", b: "and another" },
            ]);
        });
    });
});
