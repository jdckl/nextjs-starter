import { Role, User } from '@prisma/client';

export const testHelper = {
  mockApiContext: () => ({
    previewModeEncryptionKey: '',
    previewModeId: '',
    previewModeSigningKey: '',
  }),
  mockUser: () =>
    ({
      id: 'id1',
      email: 'test@test.com',
      password: 'strongpass123',
      role: 'ADMIN' as Role,
      walletId: 'wallet1',
      firstName: 'John',
      lastName: 'Doe',
      companyName: null,
      companyStreet: null,
      companyCity: null,
      companyCountry: null,
      companyId: null,
      vatId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User),
};
