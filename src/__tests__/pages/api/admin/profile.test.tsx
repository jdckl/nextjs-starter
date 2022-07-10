import http from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import supertest from 'supertest';

import prisma from '@/lib/api/prisma';
import * as tokens from '@/lib/auth/tokens';
import { testHelper } from '@/lib/testHelper';

import profileHandler from '../../../../pages/api/admin/profile';

jest.mock('@/lib/auth/tokens');

jest.mock('@/lib/auth/passwordUtils', () => ({
  encryptPassword: () => jest.fn().mockResolvedValue('encryptedPw'),
}));

describe('[POST] /api/admin/profile', () => {
  let server: http.Server;

  beforeEach(async () => {
    const requestHandler = (
      request: http.IncomingMessage,
      response: http.ServerResponse
    ) =>
      apiResolver(
        request,
        response,
        undefined,
        profileHandler,
        testHelper.mockApiContext(),
        true
      );

    server = http.createServer(requestHandler);
  });

  afterEach(() => {
    server.close();
  });

  it('should succesfuly update profile', async () => {
    const user = testHelper.mockUser();
    jest
      .spyOn(prisma.user, 'update')
      .mockResolvedValue({ ...user, password: '' });

    (tokens.userFromRequest as jest.Mock).mockImplementation(() => user);

    const result = await supertest(server)
      .post('/api/admin/profile')
      .send({ ...user, password: '' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(prisma.user.update).toHaveBeenCalled();

    expect(result.body).toBeDefined();
    expect(result.body.success).toBeDefined();
    expect(result.body.success).toBeTruthy();
  });
});
