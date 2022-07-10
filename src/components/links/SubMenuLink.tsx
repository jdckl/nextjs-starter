import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

export type SubMenuLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  nextLinkProps?: Omit<LinkProps, 'href'>;
} & React.ComponentPropsWithRef<'a'>;

const SubMenuLink = React.forwardRef<HTMLAnchorElement, SubMenuLinkProps>(
  ({ children, href, className, nextLinkProps, ...rest }, ref): JSX.Element => {
    const router = useRouter();
    const isActive = router.pathname === href;

    return (
      <div
        className={clsxm(
          'px-8 py-6 font-semibold transition-all ease-in-out hover:bg-neutral-600',
          isActive ? 'bg-neutral-600' : ''
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

export default SubMenuLink;
