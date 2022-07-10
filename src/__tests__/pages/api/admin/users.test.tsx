import http from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import supertest from 'supertest';

import prisma from '@/lib/api/prisma';
import * as tokens from '@/lib/auth/tokens';
import { testHelper } from '@/lib/testHelper';

import usersHandler from '../../../../pages/api/admin/users/index';

jest.mock('@/lib/auth/tokens');

jest.mock('@/lib/auth/passwordUtils', () => ({
  encryptPassword: () => jest.fn().mockResolvedValue('encryptedPw'),
}));

describe('[GET/PATCH] /api/admin/users', () => {
  let server: http.Server;

  beforeEach(async () => {
    const requestHandler = (
      request: http.IncomingMessage,
      response: http.ServerResponse
    ) =>
      apiResolver(
        request,
        response,
        { pageIndex: 0, pageSize: 1 },
        usersHandler,
        testHelper.mockApiContext(),
        true
      );

    server = http.createServer(requestHandler);
  });

  afterEach(() => {
    server.close();
  });

  it('should return an array of users', async () => {
    const user = testHelper.mockUser();
    jest.spyOn(prisma.user, 'findMany').mockResolvedValue([user]);

    (tokens.userFromRequest as jest.Mock).mockImplementation(() => user);

    const result = await supertest(server)
      .get('/api/admin/users')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(prisma.user.findMany).toHaveBeenCalled();

    expect(result.body).toBeDefined();
    expect(result.body).toEqual([
      expect.objectContaining({
        id: user.id,
      }),
    ]);
  });

  it('should succesfuly update user', async () => {
    const user = testHelper.mockUser();
    jest.spyOn(prisma.user, 'update').mockResolvedValue(user);

    (tokens.userFromRequest as jest.Mock).mockImplementation(() => user);

    const result = await supertest(server)
      .patch('/api/admin/users')
      .send({ ...user, password: '' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(prisma.user.update).toHaveBeenCalled();

    expect(result.body).toBeDefined();
    expect(result.body.success).toBeDefined();
    expect(result.body.success).toBeTruthy();
  });

  it('should throw on wrong user role', async () => {
    const user = testHelper.mockUser();
    user.role = 'USER';

    (tokens.userFromRequest as jest.Mock).mockImplementation(() => user);

    const result = await supertest(server)
      .patch('/api/admin/users')
      .send({ ...user, password: '' })
      .expect(500)
      .expect('Content-Type', /json/);

    expect(result.body).toBeDefined();
    expect(result.body.message).toBe('You do not have permission!');
  });

  it('should throw on non-existing user', async () => {
    const user = testHelper.mockUser();
    jest
      .spyOn(prisma.user, 'update')
      .mockRejectedValue({ name: 'Not found', message: 'User not found' });
    (tokens.userFromRequest as jest.Mock).mockImplementation(() => user);

    const result = await supertest(server)
      .patch('/api/admin/users')
      .send({ ...user, password: '' })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(result.body).toBeDefined();
    expect(result.body.error).toBeDefined();
    expect(result.body.error).toBeTruthy();
    expect(result.body.message).toBe('User not found');
  });
});
