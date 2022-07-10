import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMutation } from 'react-query';

import { LoginParams } from '@/lib/auth';
import useRefresher from '@/lib/hooks/useRefresher';

import { useAuth } from '@/context/authContext';

import Button from './buttons/Button';
import Input from './forms/Input';

export default function Login() {
  const { login } = useAuth();
  const [state, setState] = useState<LoginParams>({
    username: '',
    password: '',
  });

  const mutation = useMutation((params: LoginParams) => login(params), {
    onSuccess: useRefresher(),
  });

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!(evt.target as HTMLInputElement).name) return;

    const value = (evt.target as HTMLInputElement).value;
    setState({
      ...state,
      [(evt.target as HTMLInputElement).name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.username || !state.password) {
      toast.error('No credentials!');
      return;
    }

    mutation.mutate(state);
  };

  useEffect(() => {
    if (mutation.isError) toast.error('Wrong credentials!');
  }, [mutation.isError]);

  return (
    <main className='h-full w-full flex-grow overflow-y-hidden bg-white md:p-8'>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className='absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col bg-neutral-600 px-4 py-6 md:max-w-[30%]'
      >
        <Input
          onChange={(e) => handleInputChange(e)}
          name='username'
          inputType='text'
          className='mb-2'
          placeholder='E-mail address'
        />
        <Input
          onChange={(e) => handleInputChange(e)}
          name='password'
          inputType='password'
          className='mb-2'
          placeholder='****'
        />

        <Button
          type='submit'
          isLoading={mutation.isLoading}
          disabled={mutation.isLoading}
          className='justify-center'
        >
          Login
        </Button>
      </form>

      <Toaster />
    </main>
  );
}
