import React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header(): JSX.Element {
  return (
    <header className='primaryGradient sticky top-0 z-30'>
      <div className='layout flex h-14 items-center justify-between border-b-[1px] border-neutral-400 px-6 py-10'>
        <UnstyledLink href='/' className='w-[68px] text-center'>
          <strong>Logo</strong>
        </UnstyledLink>
        <nav className='flex flex-row gap-6'></nav>
      </div>
    </header>
  );
}
