import { User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import _Functions from '@/lib/_functions';
import clsxm from '@/lib/clsxm';

import { useAuth } from '@/context/authContext';

import Nav from './Nav';

export default function Layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Omit<User, 'password'>;
}): JSX.Element {
  const { email } = user;
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Mobile menu
    const mobileMenuToggle = document.getElementsByClassName(
        'admin--mobileMenuToggle'
      )[0],
      mobileMenu = document.getElementsByClassName('admin--mobileMenu')[0];

    mobileMenuToggle.addEventListener('click', _Functions.handleMobileMenuOpen);
    mobileMenu.addEventListener('click', _Functions.handleMobileMenuClick);

    return () => {
      mobileMenuToggle.removeEventListener(
        'click',
        _Functions.handleMobileMenuOpen
      );
      mobileMenu.removeEventListener('click', _Functions.handleMobileMenuClick);
    };
  });

  return (
    <>
      <div className='flex h-screen w-screen flex-col bg-neutral-400 md:flex-row'>
        <div className='hidden w-60 flex-col items-center justify-between border-r border-neutral-800 text-gray-400 md:flex'>
          <div className='w-full px-5'>
            <Nav />
          </div>

          <div className='flex w-full'>
            <button
              onClick={logout}
              className='mt-auto flex h-14 w-1/3 items-center justify-center bg-neutral-200 transition ease-in-out hover:bg-pink-600 hover:text-gray-300'
            >
              <svg
                className='h-6 w-6'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z'
                  fill='currentColor'
                />
                <path
                  d='M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z'
                  fill='currentColor'
                />
              </svg>
            </button>
            <Link href='/admin/profile' passHref>
              <a className='group mt-auto flex h-14 w-2/3 items-center justify-center bg-neutral-300 transition ease-in-out hover:bg-primary-500'>
                <span className='font-display ml-2 text-sm text-gray-500 group-hover:text-gray-200'>
                  {email}
                </span>
              </a>
            </Link>
          </div>
        </div>

        <div className='flex flex-grow flex-col md:w-40'>
          <div className='flex-grow overflow-auto bg-white'>{children}</div>
        </div>

        <div className='admin--mobileMenuToggle align-items-center fixed inset-x-0 bottom-4 left-4 z-10 flex h-16 w-16 place-content-center place-items-center justify-items-center rounded-full bg-gray-900 bg-opacity-60 p-4 text-center shadow-xl backdrop-blur-lg backdrop-filter md:hidden'>
          <svg
            className='h-6 w-6 text-white'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z'
              fill='currentColor'
            />
            <path
              d='M2 12.0322C2 11.4799 2.44772 11.0322 3 11.0322H21C21.5523 11.0322 22 11.4799 22 12.0322C22 12.5845 21.5523 13.0322 21 13.0322H3C2.44772 13.0322 2 12.5845 2 12.0322Z'
              fill='currentColor'
            />
            <path
              d='M3 17.0645C2.44772 17.0645 2 17.5122 2 18.0645C2 18.6167 2.44772 19.0645 3 19.0645H21C21.5523 19.0645 22 18.6167 22 18.0645C22 17.5122 21.5523 17.0645 21 17.0645H3Z'
              fill='currentColor'
            />
          </svg>
        </div>

        <div className='admin--mobileMenu fixed z-20 hidden h-screen w-screen bg-white bg-opacity-40 p-10 text-white backdrop-blur-lg backdrop-filter'>
          <Nav />

          <Link href='/admin/profile' passHref={false}>
            <a
              className={clsxm(
                'mt-2 flex h-12 w-full items-center rounded-lg px-3 transition ease-in-out',
                [
                  router.pathname == '/admin/profile'
                    ? 'bg-primary-500 text-white'
                    : '',
                ]
              )}
            >
              <svg
                className={clsxm('h-6 w-6 fill-gray-700', [
                  router.pathname == '/admin/profile' ? 'fill-white' : '',
                ])}
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z'
                />
                <path d='M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15V21H6V15C6 13.3431 7.34315 12 9 12H15C16.6569 12 18 13.3431 18 15V21H16V15Z' />
              </svg>
              <span
                className={clsxm(
                  'font-display ml-2 text-sm font-medium text-gray-600 group-hover:text-white',
                  [router.pathname === '/admin/profile' ? 'text-white' : '']
                )}
              >
                Profile
              </span>
            </a>
          </Link>

          <button
            onClick={logout}
            className='mt-8 flex h-12 w-full items-center rounded-lg px-3 transition ease-in-out'
          >
            <svg
              className='h-6 w-6 fill-gray-700'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z' />
              <path d='M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z' />
            </svg>
            <span className='font-display ml-2 text-sm font-medium text-gray-600'>
              Log out
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
