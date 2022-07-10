import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import singletonRouter from 'next/router';
import mockRouter from 'next-router-mock';
import React from 'react';

import { userFromRequest } from '@/lib/auth/tokens';
import { testHelper } from '@/lib/testHelper';

import NextApp from '@/pages/_app';
import LoginPage from '@/pages/login';

jest.mock('@/lib/auth/tokens');

// Mock Router
jest.mock('next/router', () => require('next-router-mock'));

// Describe the shape of the "req.body".
interface UpdatePostRequestBody {
  username: string;
  password: string;
}

interface UpdatePostResponseBody {
  error: string | readonly string[];
  message: string;
}

interface UpdatePostRequestParams {
  [key: string]: string | null | Date;
}

const server = setupServer(
  rest.post<
    UpdatePostRequestBody,
    UpdatePostResponseBody,
    UpdatePostRequestParams
  >('/api/login', (req, res, ctx) => {
    const { username } = req.body;

    if (username === 'hello@jdckl.dev') {
      return res(ctx.status(200), ctx.json(testHelper.mockUser()));
    }

    return res(
      ctx.status(400),
      ctx.json({
        error: 'true',
        message: 'Wrong credentials!',
      })
    );
  })
);

describe('Render login page', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/login');
    server.listen();

    // Toaster needs matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    server.close();
  });

  it('renders login correctly', async () => {
    await act(async () => {
      render(
        <NextApp
          Component={LoginPage}
          pageProps={{ children: [] }}
          auth={{ user: null, status: 'SIGNED_OUT' }}
        />
      );
    });

    const mainContainer = screen.getByRole('main');
    const username = screen.getByPlaceholderText('E-mail address');
    const password = screen.getByPlaceholderText('****');
    const button = screen.getByRole('button');

    expect(mainContainer).toBeDefined();
    expect(username).toBeDefined();
    expect(password).toBeDefined();
    expect(button).toBeDefined();
  });

  it('renders an alert on empty submit', async () => {
    await act(async () => {
      render(
        <NextApp
          Component={LoginPage}
          pageProps={{ children: [] }}
          auth={{ user: null, status: 'SIGNED_OUT' }}
        />
      );
    });

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(await screen.findByText('No credentials!')).toBeInTheDocument();
  });

  it('renders an alert on wrong credentials', async () => {
    await act(async () => {
      render(
        <NextApp
          Component={LoginPage}
          pageProps={{ children: [] }}
          auth={{ user: null, status: 'SIGNED_OUT' }}
        />
      );
    });

    const button = screen.getByRole('button');
    const username = screen.getByPlaceholderText('E-mail address');
    const password = screen.getByPlaceholderText('****');

    fireEvent.change(username, { target: { value: 'admin@admin.com' } });
    fireEvent.change(password, { target: { value: 'test' } });
    fireEvent.click(button);

    expect(await screen.findByText('Wrong credentials!')).toBeInTheDocument();
  });

  it('page redirects on existing authentication', async () => {
    const user = testHelper.mockUser();
    (userFromRequest as jest.Mock).mockImplementation(() => user);

    await act(async () => {
      render(
        <NextApp
          Component={() => <LoginPage user={user} />}
          pageProps={{ children: [] }}
          auth={{ user: user, status: 'SIGNED_IN' }}
        />
      );
    });

    await waitFor(() =>
      expect(singletonRouter).toMatchObject({ asPath: '/admin/dashboard' })
    );
  });
});
