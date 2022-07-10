import * as React from 'react';

import SideBarLink from '../links/SideBarLink';

export default function Sidebar(): JSX.Element {
  return (
    <div className='primaryGradient w-full border-b-[1px] border-r-[1px] border-neutral-400 md:sticky md:bottom-0 md:h-[calc(100vh-81px)] md:w-[110px] md:border-b-0'>
      <nav className='flex w-full flex-row items-stretch justify-evenly md:w-auto md:flex-none md:flex-col'>
        <SideBarLink className='flex justify-center' href='/'>
          Home
        </SideBarLink>
        <SideBarLink className='flex justify-center' href='/404'>
          404
        </SideBarLink>
      </nav>
    </div>
  );
}
