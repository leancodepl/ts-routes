import { arg, createRouting, segment } from '../../src';

describe('arg segment', () => {
  it('creates route with an arg segment', () => {
    const routes = createRouting({
      product: segment`/product/${arg('productId')}`,
    } as const);

    const route = routes.product({ productId: 'id' });

    expect(route).toEqual('/product/id');
  });

  it('creates route with an optional arg segment', () => {
    const routes = createRouting({
      product: segment`/product/${arg('productId', {
        optional: true,
      })}`,
    } as const);

    const route = routes.product();

    expect(route).toEqual('/product');
  });

  it('creates route with a custom pattern param', () => {
    const routes = createRouting({
      product: segment`/product/${arg('productId', {
        pattern: /[0-9]{2}/.source,
      })}`,
    } as const);

    const route = routes.product({ productId: '23' });

    expect(route).toEqual('/product/23');
  });

  it('route with a custom pattern param gets correctly validated', () => {
    const routes = createRouting({
      product: segment`/product/${arg('productId', {
        pattern: /[0-9]{2}/.source,
      })}`,
    } as const);

    expect(() => routes.product({ productId: '123' })).toThrow();
  });
});
