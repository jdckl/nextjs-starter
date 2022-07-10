import { motion } from 'framer-motion';
import React from 'react';

type BackdropProps = {
  clickHandler: () => void;
} & React.ComponentPropsWithRef<'button'>;

const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ children, clickHandler }, ref): JSX.Element => {
    return (
      <motion.div
        onClick={() => clickHandler()}
        className='fixed left-0 top-0 z-40 h-full w-full bg-black/20 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={ref}
      >
        {children}
      </motion.div>
    );
  }
);

export default Backdrop;
