import http from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import supertest from 'supertest';

import prisma from '@/lib/api/prisma';
import { testHelper } from '@/lib/testHelper';

import loginHandler from '../../../pages/api/login';

process.env.JWT_TOKEN_KEY = 'test';

jest.mock('@/lib/auth/tokens');

jest.mock('../../../lib/auth/passwordUtils', () => ({
  verifyPassword: () => jest.fn().mockResolvedValue(true),
}));

describe('[POST] /api/login', () => {
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
        loginHandler,
        testHelper.mockApiContext(),
        true
      );

    server = http.createServer(requestHandler);
  });

  afterEach(() => {
    server.close();
  });

  it('should succesfuly login', async () => {
    const user = testHelper.mockUser();
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

    const result = await supertest(server)
      .post('/api/login')
      .send({
        username: user.email,
        password: user.password,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(result.body).toBeDefined();
    expect(result.body).toEqual(
      expect.objectContaining({
        email: user.email,
        password: '',
      })
    );
  });

  it('should return 400 for non-existing user', async () => {
    const user = testHelper.mockUser();
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const result = await supertest(server)
      .post('/api/login')
      .send({
        username: user.email,
        password: user.password,
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(result.body).toBeDefined();
    expect(result.body.error).toBe('Wrong credentials');
  });
});
