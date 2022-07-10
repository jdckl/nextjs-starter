import { motion } from 'framer-motion';
import React from 'react';

import clsxm from '@/lib/clsxm';
import { ANIMATION__MODAL } from '@/lib/consts/animations';

import Backdrop from './Backdrop';

type ModalProps = {
  handleClose: () => void;
} & React.ComponentPropsWithRef<'button'>;

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ children, className, handleClose }, ref): JSX.Element => {
    return (
      <Backdrop clickHandler={handleClose}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={clsxm(
            'absolute top-1/2 left-1/2 min-w-[40%] !-translate-x-1/2 !-translate-y-1/2 rounded-md bg-white px-8 py-10',
            className
          )}
          variants={ANIMATION__MODAL}
          initial='hidden'
          animate='visible'
          exit='exit'
          ref={ref}
        >
          {children}
        </motion.div>
      </Backdrop>
    );
  }
);

export default Modal;
