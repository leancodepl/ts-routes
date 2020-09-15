import { createRouting, number, segment } from '../src/index';

describe('createRouting', () => {
  it('creates a simple route', () => {
    const routes = createRouting({
      products: segment`/products`,
    } as const);

    const route = routes.products();

    expect(route).toEqual('/products');
  });

  it('creates nested routes', () => {
    const routes = createRouting({
      products: {
        ...segment`/products`,
        children: {
          create: segment`/create`,
        },
      },
    } as const);

    const mainRoute = routes.products();
    const nestedRoute = routes.products.create();

    expect(mainRoute).toEqual('/products');
    expect(nestedRoute).toEqual('/products/create');
  });

  it('creates nested routes with params', () => {
    const routes = createRouting({
      products: {
        ...segment`/products/${number('productId')}`,
        children: {
          edit: segment`/edit`,
        },
      },
    } as const);

    const mainRoute = routes.products({ productId: '2' });
    const nestedRoute = routes.products.edit({ productId: '2' });

    expect(mainRoute).toEqual('/products/2');
    expect(nestedRoute).toEqual('/products/2/edit');
  });
});
