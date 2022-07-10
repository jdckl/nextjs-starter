import { fireEvent, render, screen } from '@testing-library/react';
import singletonRouter from 'next/router';
import mockRouter from 'next-router-mock';
import React from 'react';

import SideBar from '@/components/layout/Sidebar';

const linkHrefs = ['/', '/404'];

const renderComponent = (props = {}) => {
  return {
    ...render(<SideBar {...props} />),
    props: {
      ...props,
    },
  };
};

// Mock Router/Link
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('Rendering <SideBar />', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/');
  });

  it('Renders a <nav> element', async () => {
    renderComponent();
    expect(screen.queryByRole('navigation')).toBeInTheDocument();
  });

  it('Renders menu anchors correctly', async () => {
    renderComponent();
    const links = screen.getAllByRole('link');

    expect(links.length).toBe(2);
    links.forEach((anchor, index) => {
      expect(anchor).toHaveAttribute('href', linkHrefs[index]);
    });
  });

  it('Clicks on an anchor and redirects', async () => {
    renderComponent();
    const links = screen.getAllByRole('link');

    fireEvent.click(links[0]);
    expect(singletonRouter).toMatchObject({ asPath: linkHrefs[0] });

    fireEvent.click(links[1]);
    expect(singletonRouter).toMatchObject({ asPath: linkHrefs[1] });
  });
});
