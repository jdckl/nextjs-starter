import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

export type SideBarLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
} & React.ComponentPropsWithRef<'a'>;

const SideBarLink = React.forwardRef<HTMLAnchorElement, SideBarLinkProps>(
  ({ children, href, className, nextLinkProps, ...rest }, ref): JSX.Element => {
    const router = useRouter();
    const isActive =
      router.pathname === href ||
      (router.pathname === '/unstake' && href === '/stake');

    return (
      <div
        className={clsxm(
          'w-full border-l-[1px] border-r-[1px] border-transparent py-6 transition-all ease-in-out hover:border-b-[1px] hover:border-t-[1px] hover:border-neutral-400 hover:bg-neutral-600 md:border-b-[1px] md:border-t-[1px]',
          isActive
            ? 'border-t-[1px] border-neutral-400 bg-neutral-600 md:border-b-[1px]'
            : ''
        )}
      >
        <Link href={href} {...nextLinkProps}>
          <a ref={ref} {...rest} className={className}>
            {children}
          </a>
        </Link>
      </div>
    );
  }
);

export default SideBarLink;
