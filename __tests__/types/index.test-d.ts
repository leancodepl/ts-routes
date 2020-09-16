import { createRouting, number, segment, query } from "../../lib/index";
import { expectError, expectType } from "tsd";

const routes = createRouting({
    user: segment`/users/${number("userId")}`,
    products: {
        ...segment`/products${query({ filter: true, optionalFilter: false })}`,
        children: {
            product: segment`/${number("productId")}`,
        },
    },
    order: segment`/orders/${number("orderId", true)}`,
} as const);

// Passes when the required param is specified
expectType<string>(routes.user({ userId: "12" }));

// Expects the required param to be passed
expectError(routes.user());
expectError(routes.user({}));

// Does not allow undefined query params
expectError(routes.user({ userId: "12" }, { filter: "a" }));

// Does not allow other params than the productId
expectError(routes.user({ otherId: "12" }));

// Does not allow any extra params that are not defined
expectError(routes.user({ userId: "12", otherId: "12" }));

// Passes when only required query params are specified
expectType<string>(routes.products({}, { filter: "some" }));

// Passes with both required and optional query params specified
expectType<string>(routes.products({}, { filter: "some", optionalFilter: "2" }));

// Expects the required query param to be passed
expectError(routes.products({}, {}));

// Does not allow undefined route params
expectError(routes.products({ otherId: "121212" }, { filter: "some" }));

// Does not allow undefined query params
expectError(routes.products({}, { filter: "some", a: "a" }));

// Passes when all required params from parent routes are specified
expectType<string>(routes.products.product({ productId: "12" }, { filter: "a" }));

// Expects parent query params in child routes
expectError(routes.products.product({ productId: "12" }));

// Passes when optional route params are not specified
expectType<string>(routes.order());
expectType<string>(routes.order({}));

// Does not allow query argument when no query params are defined
expectError(routes.order({}, {}));
