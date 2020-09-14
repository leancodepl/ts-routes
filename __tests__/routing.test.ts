import { createRouting, number, segment } from '../src/index';

describe('routing', () => {
  it('should create routing', () => {
    const routes = createRouting({
      company: segment`/companies/${number('companyId')}`,
      contact: segment`/contacts/${number('contactId')}`,
      insight: segment`/insight/${number('insightId')}`,
      admin: {
        ...segment`/admin`,
        children: {
          users: segment`/users`,
        },
      },
      onetime: segment`/onetime`,
    } as const);

    routes.company({ companyId: '20' });
  });
});