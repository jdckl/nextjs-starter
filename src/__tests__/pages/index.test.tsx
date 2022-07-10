import { act, render, screen } from '@testing-library/react';
import React from 'react';

import NextApp from '@/pages/_app';
import NotFound from '@/pages/404';
import HomePage from '@/pages/index';

// Mock Router
jest.mock('next/router', () => require('next-router-mock'));

describe('Render <NextApp> module', () => {
  it('renders index correctly', async () => {
    await act(async () => {
      render(
        <NextApp
          Component={HomePage}
          pageProps={{ children: [] }}
          auth={{ user: null, status: 'SIGNED_OUT' }}
        />
      );
    });

    const main = screen.queryAllByRole('main');

    expect(main.length).toBe(1);
    expect(main[0].textContent).toBe('Page content goes here :)');
  });

  it('renders 404 correctly', async () => {
    await act(async () => {
      render(
        <NextApp
          Component={NotFound}
          pageProps={{ children: [] }}
          auth={{ user: null, status: 'SIGNED_OUT' }}
        />
      );
    });

    const headings = screen
      .queryAllByRole('heading')
      .filter((heading) => heading.tagName === 'H1');

    expect(headings.length).toBe(1);
    expect(headings[0].textContent).toBe('Page Not Found');
  });
});
