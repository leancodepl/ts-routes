import { createRouting, number, query, segment } from "../../lib/index";
import { expectError, expectType } from "tsd";

const routes = createRouting({
    login: segment`/login`,
    user: segment`/users/${number("userId")}`,
    products: {
        ...segment`/products`,
        query: {
            filter: query(false),
            optionalFilter: query(true),
            object: query<{ test: string }, true>(true),
        },
        children: {
            product: segment`/${number("productId")}`,
        },
    },
    order: segment`/orders/${number("orderId", { optional: true })}`,
});

// Should not allow creating routing from raw strings
expectError(createRouting({ login: "/login" }));

// Passes without arguments when there are no required parameters or query parameters
expectType<string>(routes.login());

// Passes when the required param is specified
expectType<string>(routes.user({ userId: "12" }));

// Expects the required param to be passed
expectError(routes.user());
expectError(routes.user({}));

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

// Does not allow undefined query params
expectError(routes.products({}, { filter: "some", a: "a" }));

// Passes when all required params from parent routes are specified
expectType<string>(routes.products.product({ productId: "12" }, { filter: "a" }));

// Expects parent query params in child routes
expectError(routes.products.product({ productId: "12" }));

// Passes when optional route params are not specified
expectType<string>(routes.order());
expectType<string>(routes.order({}));

// Allow passing array as query values
expectType<string>(routes.products(undefined, { filter: ["some", "another"] }));

// Does not allow invalid type of query parameter
expectError(routes.products(undefined, { object: "abc" }));

// Allow object for object type of query parameter
expectType<string>(routes.products(undefined, { filter: "some", object: { test: "test" } }));
