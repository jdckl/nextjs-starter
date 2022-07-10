import * as React from 'react';
import { ImSpinner2 } from 'react-icons/im';

import clsxm from '@/lib/clsxm';

type BoxProps = {
  isLoading?: boolean;
} & React.ComponentPropsWithRef<'div'>;

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, className, isLoading, ...rest }, ref): JSX.Element => {
    return (
      <div
        ref={ref}
        className={clsxm(
          'flex flex-grow flex-col rounded-md bg-neutral-800 p-4',
          className
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={clsxm(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            )}
          >
            <ImSpinner2 className='animate-spin' />
          </div>
        )}
        {children}
      </div>
    );
  }
);

export default Box;
