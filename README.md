# ts-routes

[![npm](https://img.shields.io/npm/v/ts-routes)](https://www.npmjs.com/package/ts-routes)
[![Actions Status](https://github.com/leancodepl/ts-routes/workflows/build/badge.svg)](https://github.com/leancodepl/ts-routes/actions)

Helper library for constructing strongly typed parameterized routing paths. It prevents you from passing hardcoded
strings with routes across the app.

## Installation

```
npm install ts-routes
yarn add ts-routes
```

## Quick start

First, define your routes as an array of `RouteElement`:

```typescript
const routes = [
    { name: "home", path: "" },
    { name: "products", path: "products/" },
    { name: "users", path: "users/:userId" },
    {
        name: "items",
        path: "items/",
        children: [
            { name: "item", path: ":itemId" },
            { name: "edit", path: "edit/:itemId" },
        ],
    },
] as const;
```

Then, create your path-making function using `mkPath`:

```typescript
import { mkPath } from "@leancodepl/ts-routes";

const path = mkPath(routes);
```

Now, you can create paths like this:

```typescript
const homePath = path("home"); // Output: '/'
const productsPath = path("products"); // Output: '/products/'
const userPath = path("users", { userId: "42" }); // Output: '/users/42'
const itemPath = path("items", "item", { itemId: "1" }); // Output: '/items/1'
const editItemPath = path("items", "edit", { itemId: "1" }); // Output: '/items/edit/1'
```

## Examples

### Usage with `react-router`:

#### Route definition

```typescript
import { useRoutes } from "react-router";

type MutableDeep<T> = T extends string
    ? T
    : T extends ReadonlyArray<infer ArrayType>
    ? Array<MutableDeep<ArrayType>>
    : {
          -readonly [K in keyof T]: MutableDeep<T[K]>;
      };

const routes = [
    { name: "home", path: "" },
    { name: "products", path: "products/" },
    { name: "users", path: "users/:userId" },
    // ...
] as const;

export path = mkPath(routes);

const mutableRoutes = routes as unknown as MutableDeep<typeof routes>; // React Router typings are not compatible with readonly objects

function App() {
    const router = useRoutes(routes);

    return <main>{router}</main>;
}
```

This will create an equivalent of `<Routes>` component with routes defined in `routes` array, more info about
`useRoutes` [here](https://reactrouter.com/en/main/hooks/use-routes).

#### Page navigation

Function created with `mkPath` can be used to generate paths for `Link` component or any other navigation method:

```typescript
import { Link } from "react-router-dom";
import { path } from "./path";

function DemoLink() {
    return <Link to={path("home")}>Home</Link>;
}
```

## API

### `mkPath(routes: RouteElement[])`

Create a path-making function based on a list of `RouteElement`.

-   `routes` - An array of route elements to create the path-making function.

### `RouteElement`

`{ name: string; path: string; children?: readonly RouteElement[] }`

A single route element that defines:

-   `name` - The name of the route.
-   `path` - The path associated with the route. Can contain variables like `:userId`.
-   `children` (optional) - An array of child routes.
