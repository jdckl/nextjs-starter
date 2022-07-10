import { User } from '@prisma/client';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import AsyncSelect from 'react-select/async';

export type UserSelectData = {
  value: string;
  label: string;
};

const filterUsers = async (inputValue: string) => {
  try {
    const users = await axios.get('/api/admin/users', {
      withCredentials: true,
      params: {
        query: inputValue,
        role: 'USER',
      },
    });

    return users.data.map((u: User) => {
      return { value: u.id, label: u.email };
    });
    // eslint-disable-next-line
  } catch (error: any) {
    if (error?.response?.data?.message)
      toast.error(error.response.data.message);
  }
};

const promiseOptions = (inputValue: string) =>
  new Promise<UserSelectData[]>((resolve) => {
    setTimeout(() => {
      resolve(filterUsers(inputValue));
    }, 1000);
  });

const UsersSelect: React.FC<React.ComponentPropsWithoutRef<'select'>> = (
  props
) => {
  //if (props.serverData && props.setOption) props.setOption(props.serverData);

  return (
    <AsyncSelect
      className='custom-select mb-3 block w-full rounded border-gray-300 bg-white leading-tight text-gray-600 placeholder-gray-200 transition ease-in-out focus:border-gray-400 focus:outline-none'
      cacheOptions
      defaultOptions
      // @ts-ignore
      loadOptions={promiseOptions}
      instanceId='user-select'
      isDisabled={props.disabled}
      {...props}
    />
  );
};

export default UsersSelect;
