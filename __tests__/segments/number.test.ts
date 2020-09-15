import { createRouting, number, segment } from '../../src';

describe('number segment', () => {
  it('creates route with an optional number param', () => {
    const routes = createRouting({
      product: segment`/product/${number('productId', true)}`,
    } as const);

    const route = routes.product();

    expect(route).toEqual('/product');
  });

  it('creates route with a required number param', () => {
    const routes = createRouting({
      product: segment`/product/${number('productId')}`,
    } as const);

    const route = routes.product({ productId: '1' });

    expect(route).toEqual('/product/1');
  });

  it('throws when given an invalid number param', () => {
    const routes = createRouting({
      product: segment`/product/${number('productId')}`,
    } as const);

    expect(() => routes.product({ productId: 'aaa' })).toThrow();
  });
});
