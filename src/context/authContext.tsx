import { User } from '@prisma/client';
import axios from 'axios';
import { NextPageContext } from 'next';
import router from 'next/router';
import { FC, ReactNode, useState } from 'react';
import { createContext, useContext } from 'react';

import { LoginParams } from '@/lib/auth';

export interface AdminProps {
  user: User;
}

export type Context = {
  auth: {
    status: 'SIGNED_OUT' | 'SIGNED_IN';
    user: User | null;
  };
  login: ({ username, password }: LoginParams) => Promise<boolean>;
  logout: () => Promise<boolean>;
};

// Application context for holding basic auth
const AppContext = createContext<Context>({
  auth: { status: 'SIGNED_OUT', user: null },
  login: async () => false,
  logout: async () => false,
});

// Provider to wrap components in
const AppContextProvider: FC<{ children: ReactNode; auth: Context['auth'] }> = (
  props
) => {
  const [auth, setAuth] = useState(
    props.auth || { status: 'SIGNED_OUT', user: null }
  );

  // Base logout handler
  const logout = async () => {
    try {
      await axios.delete(`/api/login`, {
        withCredentials: true,
      });
    } catch (e) {
      return false;
    } finally {
      setAuth({ status: 'SIGNED_OUT', user: null });
      router.push('/login');
    }

    return true;
  };

  // Base login handler
  const login = async (args: {
    username: string;
    password: string;
  }): Promise<boolean> => {
    const { username, password } = args;
    try {
      const response = await axios({
        method: 'post',
        url: `/api/login`,
        data: { username, password },
        withCredentials: true,
      });

      if (response.data) {
        setAuth({ status: 'SIGNED_IN', user: response.data });
        router.push('/admin/dashboard');
        return true;
      }

      setAuth({ status: 'SIGNED_OUT', user: null });
      if (!router.asPath.includes('login')) router.push('/login');
      return false;
    } catch (e) {
      setAuth({ status: 'SIGNED_OUT', user: null });
      if (!router.asPath.includes('login')) router.push('/login');
      throw e;
    }
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        login,
        logout,
      }}
      {...props}
    />
  );
};

// Retrieve user token/status
export const getUser = async (
  ctx: NextPageContext
): Promise<Context['auth']> => {
  try {
    const response = await axios.get(`/api/token`, {
      headers: ctx.req?.headers.cookie
        ? { cookie: ctx.req.headers.cookie }
        : undefined,
      withCredentials: true,
    });

    if (response.data) {
      return { status: 'SIGNED_IN', user: response.data };
    } else {
      return { status: 'SIGNED_OUT', user: null };
    }
  } catch (e) {
    return { status: 'SIGNED_OUT', user: null };
  }
};

export const useAuth = () => useContext(AppContext);
export const AuthConsumer = AppContext.Consumer;
export default AppContextProvider;
