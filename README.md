# ts-routes

![npm](https://img.shields.io/npm/v/ts-routes)
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
import { createRouting, number, query, uuid } from 'ts-routes';

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
routes.users({ userId: '10' }) // '/users/10'
routes.items({}, { filter: 'new' }) // '/items?filter=new'
routes.items.item({ itemId: '12d66718-e47c-4a2a-ad5b-8897def2f6a7' }) // '/items/12d66718-e47c-4a2a-ad5b-8897def2f6a7'
```

## Usage

### Routing

To use stronly typed paths, you first have to create the routing object by calling `createRouting` and providing an
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

When creating a route query strings can be passed in a first argument:

```js
routes.users({ userId: "10" });
```

There are some predefined convenience parameter types provided:

-   `number(name: string, optional?: boolean)` for number strings
-   `uuid(name: string, optional?: boolean)` for UUID strings

### Query string

Query string parameters can be specified by interpolating `query` function inside a segment string. The `query` function
expects an object where keys are names of parameters and values specify whether those params are required in a path.

```js
segment`/product${query({
    productId: true,
    details: false,
})}`;
```

The above segment defines a path which expects a `productId` URL param and an optional `details` URL param.

When creating a route query strings can be passed in a second argument:

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
