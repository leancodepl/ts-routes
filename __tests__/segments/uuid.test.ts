import { createRouting, segment, uuid } from "../../src";

describe("uuid segment", () => {
    const testUuid = "3d368832-0bc0-4fcc-bf75-5bd8794c1ad3";

    it("creates route with an optional uuid param", () => {
        const routes = createRouting({
            product: segment`/product/${uuid("productId", "optional")}`,
        } as const);

        const route = routes.product();

        expect(route).toEqual("/product");
    });

    it("creates route with a required uuid param", () => {
        const routes = createRouting({
            product: segment`/product/${uuid("productId")}`,
        } as const);

        const route = routes.product({ productId: testUuid });

        expect(route).toEqual(`/product/${testUuid}`);
    });

    it("throws when given a plain string", () => {
        const routes = createRouting({
            product: segment`/product/${uuid("productId")}`,
        } as const);

        expect(() => routes.product({ productId: "a" })).toThrow();
    });

    it("throws when given an invalid uuid", () => {
        const routes = createRouting({
            product: segment`/product/${uuid("productId")}`,
        } as const);

        expect(() => routes.product({ productId: "3d368832-0bc-4fcc-bf75-5bd8794c1ad3" })).toThrow();
    });

    it("returns correct pattern", () => {
        const uuidPattern = "[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}";
        const routes = createRouting({
            product: segment`/product/${uuid("productId")}`,
        } as const);

        const pattern = routes.product.pattern;

        expect(pattern).toEqual(`/product/:productId(${uuidPattern})`);
    });
});
