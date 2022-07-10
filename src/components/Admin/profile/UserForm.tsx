import { User } from '@prisma/client';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';

type UserFormProps = {
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  state: Pick<User, 'email' | 'firstName' | 'lastName' | 'password' | 'role'>;
  formLoading?: boolean;
  editForm?: boolean;
  submittable?: boolean;
} & React.ComponentPropsWithRef<'form'>;

const UserForm = React.forwardRef<HTMLFormElement, UserFormProps>(
  (
    {
      className,
      state,
      handleSubmit,
      handleChange,
      formLoading,
      editForm,
      submittable,
      ...rest
    },
    ref
  ): JSX.Element => {
    return (
      <form
        ref={ref}
        className={clsxm('w-full px-2 py-2', className)}
        onSubmit={handleSubmit}
        {...rest}
      >
        <div className='-mx-3 mb-1 flex flex-wrap'>
          <div className='mb-6 w-full px-3 md:mb-0 md:w-1/2'>
            <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600'>
              First Name
            </label>
            <Input
              value={state.firstName || ''}
              onChange={handleChange.bind(this)}
              name='firstName'
              className='mb-3 block w-full appearance-none rounded border border-gray-300 bg-white py-3 px-4 leading-tight text-gray-600 placeholder-gray-200 transition ease-in-out focus:border-gray-400 focus:outline-none'
              inputType='text'
              placeholder='Jane'
            />
          </div>
          <div className='w-full px-3 md:w-1/2'>
            <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600'>
              Last Name
            </label>
            <Input
              value={state.lastName || ''}
              onChange={handleChange.bind(this)}
              name='lastName'
              className='block w-full appearance-none rounded border border-gray-300 bg-white py-3 px-4 leading-tight text-gray-600 placeholder-gray-200 transition ease-in-out focus:border-gray-400 focus:outline-none'
              inputType='text'
              placeholder='Doe'
            />
          </div>
        </div>
        <div className='-mx-3 mb-1 flex flex-wrap'>
          <div className='w-full px-3 md:w-1/3'>
            <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600'>
              E-mail
              {!editForm ? (
                <span className='text-red'>*</span>
              ) : (
                <small className='float-right mb-2 text-gray-300'>
                  This is your login.
                </small>
              )}
            </label>
            <Input
              value={state.email}
              onChange={handleChange.bind(this)}
              name='email'
              className='block w-full appearance-none rounded border border-gray-300 bg-white py-3 px-4 leading-tight text-gray-600 placeholder-gray-200 transition ease-in-out focus:border-gray-400 focus:outline-none'
              inputType='email'
              required
              placeholder='john@prozium.com'
            />
          </div>
          <div className='w-full px-3 md:w-1/3'>
            <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600'>
              Password
              {!editForm ? (
                <span className='text-red'>*</span>
              ) : (
                <small className='float-right mb-2 text-gray-300'>
                  You can change the password by filling up this field.
                </small>
              )}
            </label>
            <Input
              value={state.password}
              onChange={handleChange.bind(this)}
              name='password'
              className='mb-3 block w-full appearance-none rounded border border-gray-300 bg-white py-3 px-4 leading-tight text-gray-600 placeholder-gray-200 transition ease-in-out focus:border-gray-400 focus:outline-none'
              inputType='password'
              required={!editForm}
              placeholder='Password'
            />
          </div>
          <div className='w-full px-3 md:w-1/3'>
            <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600'>
              Role
              {!editForm && <span className='text-red'>*</span>}
            </label>
            <select
              value={state.role}
              disabled={editForm ? true : false}
              onChange={handleChange.bind(this)}
              name='role'
              required
              className='mb-3 block w-full appearance-none rounded border border-gray-300 bg-white py-3 px-4 leading-tight text-gray-600 placeholder-gray-200 transition ease-in-out focus:border-gray-400 focus:outline-none'
            >
              <option value='ADMIN'>Admin</option>
              <option value='USER'>User</option>
            </select>
          </div>
        </div>

        {submittable && (
          <div className='mt-4 mb-1 flex w-full flex-row border-t border-dashed pt-6'>
            <Button isLoading={formLoading} type='submit'>
              {editForm ? 'Save profile' : 'Create user'}
            </Button>
          </div>
        )}
      </form>
    );
  }
);

export default UserForm;
