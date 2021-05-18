# ts-routes

[![npm](https://img.shields.io/npm/v/ts-routes)](https://www.npmjs.com/package/ts-routes)
[![Actions Status](https://github.com/leancodepl/ts-routes/workflows/build/badge.svg)](https://github.com/leancodepl/ts-routes/actions)

Helper library for constructing strongly typed parameterized routing paths. It prevents you from passing hardcoded
strings with routes across the app.

ts-routes is independent on routing libraries and can be used together with e.g. React Router DOM or Vue Router.

## Installation

```
npm install ts-routes
yarn add ts-routes
```

## Quick start

```js
import { createRouting, number, query, segment, uuid } from 'ts-routes';

const routes = createRouting({
    products: segment`/products`,
    users: segment`/users/${number('userId')}`,
    items: {
        ...segment`/items${query({ filter: false })}`,
        children: {
            item: segment`/${uuid('itemId')}`,
        },
    },
} as const);

routes.products(); // '/products'
routes.products.pattern // '/products'

routes.users({ userId: '10' }) // '/users/10'
routes.users.pattern // '/users/:userId([0-9]+)

routes.items({}, { filter: 'new' }) // '/items?filter=new'
routes.items.pattern // '/items'

routes.items.item({ itemId: '12d66718-e47c-4a2a-ad5b-8897def2f6a7' }) // '/items/12d66718-e47c-4a2a-ad5b-8897def2f6a7'
routes.items.item.pattern // `/items/:itemId(${uuidRegex})`
```

## Usage

### Routing

To use strongly typed paths, you first have to create the routing object by calling `createRouting` and providing an
object defining segments. Segments represent single routing paths and are implemented as tagged template literals:

```js
const routes = createRouting({
    users: segment`/users`
} as const);
```

### Parameters

You can define route params (i.e. parts of the path that are variable) by interpolating the `arg` function inside a
segment:

```js
segment`/users/${arg("userId")}`;
```

This will enable you to create paths like `/users/1` or `/users/username`.

By default route parameters are treated as required. You can make them optional by providing extra configuration. It is
also possible to limit possible parameter values by passing a regex string. While trying to create a route which doesn't
satisfy the pattern, an exception will be thrown.

```js
segment`/users/${arg("userId", {
    optional: true,
    pattern: "[0-9]",
})}`;
```

When creating a route, path parameters can be passed in the first argument:

```js
routes.users({ userId: "10" });
```

There are some predefined convenience parameter types provided:

-   `number(name: string, optional?: boolean)` for number strings
-   `uuid(name: string, optional?: boolean)` for UUID strings

### Query string

Query string parameters can be specified by interpolating `query` function inside a segment string. The `query` function
expects an object where keys are names of parameters and values specify whether those params are required in the path.

```js
segment`/product${query({
    productId: true,
    details: false,
})}`;
```

The above segment defines a path which expects the `productId` URL param and the optional `details` URL param.

When creating a route query strings can be passed in the second argument:

```js
routes.products(
    {},
    {
        productId: "10",
        details: "false",
    },
);
```

which will return `/product?details=false&productId=10`.

### Nested routes

Routes can be nested by providing an optional `children` property to segments:

```js
const routes = createRouting({
    parent: {
        ...segment`/parent`,
        children: {
            child: segment`/child`,
        },
    },
} as const);
```

Child routes are attached to the parent route object so that to construct a child route you can call
`routes.parent.child()` (which will return `/parent/child`).

Routes can be deeply nested and child routes will include all required and optional route parameters and query string
parameters from parent routes.

### Patterns

While creating a routing, alongside path string generators, patterns for those paths compatible with
[path-to-regexp](https://github.com/pillarjs/path-to-regexp) are generated. You can access them via the `pattern`
property:

```
routes.products.pattern
```

Those patterns are useful for integration with routing libraries which support
[path-to-regexp](https://github.com/pillarjs/path-to-regexp)-style syntax (e.g. React Router DOM, Vue Router).

### React Router DOM

You can use patterns for defining routes:

```jsx
<Route exact component={ProductsPage} path={routes.products.pattern} />
```

With React it's also useful to add some helper types which can be used for typing routing props for components:

```ts
import { FunctionComponent } from "react";
import { RouteComponentProps } from "react-router-dom";
import { RouteParamsFor } from "ts-routes";

type PageProps<TPathParams extends (...args: any[]) => string> = RouteComponentProps<RouteParamsFor<TPathParams>>;

type PageComponent<TPathParams extends (...args: any[]) => string> = FunctionComponent<PageProps<TPathParams>>;
```

Which you can then use like so:

```tsx
type ProductsPageProps = PageProps<typeof routes.products>;

const ProductPage: PageComponent<typeof routes.products> = ({
    match: {
        params: { productId },
    },
}) => <div>{productId}</div>;
```

And for query string params:

```ts
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { QueryParamsFor } from "ts-routes";

function useQueryParams() {
    const location = useLocation();
    return useMemo(() => new URLSearchParams(location.search), [location.search]);
}

function useQueryParamsGuarded<T extends (...args: any) => any>() {
    return useQueryParams() as URLSearchParams & { get(name: keyof NonNullable<QueryParamsFor<T>>): string | null };
}

const redirectUrl = useQueryParamsGuarded<typeof routes.login>().get("redirect");
```

### Vue Router

You can use patterns for defining routes:

```js
const router = new VueRouter({
    routes: [
        {
            path: routes.products.pattern,
            component: ProductsPage,
        },
    ],
});
```
