import * as React from 'react';

import clsxm from '@/lib/clsxm';

type ContentBoxProps = {
  title?: string;
  size: string;
} & React.ComponentPropsWithRef<'div'>;

const ContentBox = React.forwardRef<HTMLDivElement, ContentBoxProps>(
  ({ children, className, title, size, ...rest }, ref): JSX.Element => {
    return (
      <div
        ref={ref}
        className={clsxm(
          `flex flex-col rounded-md bg-neutral-400 shadow-sm ${size}`,
          className
        )}
        {...rest}
      >
        {title ? (
          <header className='text-md px-5 py-4 font-semibold text-gray-800'>
            {title}
          </header>
        ) : (
          ''
        )}

        {children ? (
          <div className='flex flex-col content-center justify-items-center rounded-b-lg border-t border-dashed border-neutral-600 bg-neutral-500 py-3 px-3 md:justify-between'>
            {children}
          </div>
        ) : (
          ``
        )}
      </div>
    );
  }
);

export default ContentBox;
