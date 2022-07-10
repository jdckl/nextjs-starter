import * as React from 'react';

import SubMenuLink from '../links/SubMenuLink';

export default function SubMenu(): JSX.Element {
  return (
    <div className='-m-8 mb-8 border-b-[1px] border-neutral-400 bg-neutral-500'>
      <nav className='flex w-full flex-row px-8 md:w-auto'>
        <SubMenuLink href='/stake'>Stake</SubMenuLink>
        <SubMenuLink href='/unstake'>Unstake</SubMenuLink>
      </nav>
    </div>
  );
}
