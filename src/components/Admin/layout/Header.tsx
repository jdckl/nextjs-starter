import * as React from 'react';

import clsxm from '@/lib/clsxm';

type HeaderProps = {
  icon?: JSX.Element;
  title: string;
  subTitle?: string;
} & React.ComponentPropsWithRef<'div'>;

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  (
    { className, children, icon, title, subTitle, ...rest },
    ref
  ): JSX.Element => {
    return (
      <div
        ref={ref}
        className={clsxm(
          'w-100 h-30 sticky top-0 z-10 flex flex-col items-center justify-start bg-primary-500 bg-opacity-60 p-2 pt-4 shadow-sm backdrop-blur-lg backdrop-filter md:flex-row md:p-6 md:pt-6',
          className
        )}
        {...rest}
      >
        {icon && <div className='mr-2 text-indigo-400'>{icon}</div>}
        <div className='font-display text-xl font-semibold text-gray-100'>
          {title}
          {subTitle && (
            <>
              <span className='ml-2 mr-2 text-gray-100'>/</span>
              {subTitle}
            </>
          )}
        </div>

        <div className='mt-2 flex-1 text-right md:mt-0'>{children}</div>
      </div>
    );
  }
);

export default Header;
