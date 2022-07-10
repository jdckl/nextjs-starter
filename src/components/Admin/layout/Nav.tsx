import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

type NavProps = {
  userrole?: string;
} & React.ComponentPropsWithRef<'div'>;

const Nav = React.forwardRef<HTMLDivElement, NavProps>(
  ({ className, ...rest }, ref): JSX.Element => {
    const router = useRouter();

    return (
      <div
        className={clsxm(
          'font-display mt-3 flex w-full flex-col items-center border-neutral-800',
          className
        )}
        ref={ref}
        {...rest}
      >
        <Link href='/admin/dashboard' passHref>
          <a
            className={clsxm(
              'group mt-2 flex h-12 w-full items-center rounded-lg px-3 transition ease-in-out hover:bg-primary-500 hover:text-white',
              [router.pathname == '/admin/dashboard' ? 'bg-primary-500' : '']
            )}
          >
            <svg
              className={clsxm('h-6 w-6 fill-gray-700 group-hover:fill-white', [
                router.pathname === '/admin/dashboard' ? 'fill-white' : '',
              ])}
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M7 7V11H11V7H7Z' />
              <path d='M13 7H17V11H13V7Z' />
              <path d='M13 13V17H17V13H13Z' />
              <path d='M7 13H11V17H7V13Z' />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M3 3H21V21H3V3ZM5 5V19H19V5H5Z'
              />
            </svg>
            <span
              className={clsxm(
                'font-display ml-2 text-sm font-medium text-gray-600 group-hover:text-white',
                [router.pathname === '/admin/dashboard' ? 'text-white' : '']
              )}
            >
              Dashboard
            </span>
          </a>
        </Link>
        <Link href='/admin/users' passHref>
          <a
            className={clsxm(
              'group mt-2 flex h-12 w-full items-center rounded-lg px-3 transition ease-in-out hover:bg-primary-500 hover:text-white',
              [
                ['/admin/users', '/admin/users/add'].includes(router.pathname)
                  ? 'bg-primary-500'
                  : '',
              ]
            )}
          >
            <svg
              className={clsxm('h-6 w-6 fill-gray-700 group-hover:fill-white', [
                ['/admin/users', '/admin/users/add'].includes(router.pathname)
                  ? 'fill-white'
                  : '',
              ])}
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z'
              />
              <path d='M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z' />
              <path d='M22 11H16V13H22V11Z' />
              <path d='M16 15H22V17H16V15Z' />
              <path d='M22 7H16V9H22V7Z' />
            </svg>
            <span
              className={clsxm(
                'font-display ml-2 text-sm font-medium text-gray-600 group-hover:text-white',
                [
                  ['/admin/users', '/admin/users/add'].includes(router.pathname)
                    ? 'text-white'
                    : '',
                ]
              )}
            >
              Users
            </span>
          </a>
        </Link>
      </div>
    );
  }
);

export default Nav;
