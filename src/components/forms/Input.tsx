import * as React from 'react';

import clsxm from '@/lib/clsxm';

type InputProps = {
  inputType: string;
  hasBtn?: boolean;
  value?: string | number;
} & React.ComponentPropsWithRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasBtn, inputType, ...rest }, ref): JSX.Element => {
    return (
      <input
        ref={ref}
        type={inputType}
        className={clsxm(
          'border-1 w-full rounded-md border-gray-300 bg-white px-4 py-2 leading-tight text-gray-600 placeholder-gray-200 transition ease-in-out focus:border-gray-400 focus:outline-none',
          hasBtn && 'input-button',
          className,
          [inputType !== 'range' && 'min-h-[46px]']
        )}
        {...rest}
      />
    );
  }
);

export default Input;
